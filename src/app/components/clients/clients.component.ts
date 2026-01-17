import { Component } from '@angular/core';
import { Client, Pet } from '../../../types';
import { ClientService } from '../../services/client.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { ClientsTableComponent } from './clients-table/clients-table.component';
import { RouterLink } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ClientRegistrationPayload, ClientsDialogComponent } from './clients-dialog/clients-dialog.component';
import { PetService } from '../../services/pet.service';
import { forkJoin, of, switchMap } from 'rxjs';


@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastModule, ClientsTableComponent, RouterLink, ConfirmDialogModule, DialogModule, ClientsDialogComponent],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss'
})
export class ClientsComponent {
  clients: Client[] = []
  selected: Client | null = {
    id: 0,
    docNum: '',
    docType: '',
    fullName: '',
    phone: '',
    address: '',
    state: 'alta',

    petsCount: 0,
  };

  dniFilter: string = '';
  docTypeFilter: string = '';
  showDialog: boolean = false;
  dialogTitle: string = '';
  renderDialogContent: boolean = false;
  editMode: boolean = false;

  constructor(
    private clientService: ClientService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private petService: PetService,
  ) { }

  ngOnInit() {
    this.findClients()
  }

  findClients(): void {
    this.clientService.findAll().subscribe((data: Client[]) => {

      this.clients = data.filter(client => {

        const matchesDocNum =
          !this.dniFilter || client.docNum.includes(this.dniFilter);

        const matchesDocType =
          !this.docTypeFilter || client.docType === this.docTypeFilter;

        return matchesDocNum && matchesDocType;
      });

    });
  }

  newClient() {
    this.selected = null;
    this.dialogTitle = 'Nuevo Cliente';
    this.renderDialogContent = true;
    this.showDialog = true;
  }

  editClient(client: Client) {
    this.selected = client;
    this.dialogTitle = 'Editar Cliente';
    this.renderDialogContent = true;
    this.showDialog = true;
    this.editMode = true;
  }

  createClient(client: Client): void {
    this.clientService.post(client).subscribe(
      (newClient: Client) => {
        this.clients.push(newClient); 
      },
    );
  }

  onSave(data: any) {
    if (this.selected) {
      this.updateClient(this.selected.id!, data);
      this.showDialog = false;
      return;
    } 

    this.createClientAndPets(data);
  }

  onCancel() {
    this.showDialog = false;
  }

  onDialogHide() {
    this.renderDialogContent = false;
  }

  updateClient(id: number, client: Client): void {
    this.clientService.patch(id, client).subscribe(
      (updatedClient: Client) => {
        const index = this.clients.findIndex(c => c.id === id);
        if (index > -1) this.clients[index] = updatedClient;

        this.findClients();
      },
    );
  }

  deleteClient(id: number): void {
    this.clientService.delete(id).subscribe(
      () => {
        this.clients = this.clients.filter(c => c.id !== id);
      },
    );
  }

  changePetClientId$(pet: Pet, adoptingClientId: number) {

    const updatedPet: Pet = {
      name: pet.name,
      age: pet.age,
      birthDate: pet.birthDate,
      state: pet.state,
      breedId: pet.breedId,
      clientId: adoptingClientId,
    };

    return this.petService.patch(pet.id!, updatedPet)

  }

  registerPet$(data: any, clientId: number) {

    const newPet: Pet = {
      name: data.name,
      birthDate: data.birthDate,
      age: Math.floor((new Date().getTime() - new Date(data.birthDate).getTime()) / (1000 * 60 * 60 * 24 * 365.25)),
      state: data.state,
      clientId: clientId,
      breedId: data.breed,
    };

    return this.petService.post(newPet)
    
  }

  private createClientAndPets(payload: ClientRegistrationPayload): void {
    this.clientService.post(payload.client).pipe(

      switchMap((newClient: Client) => {
        this.clients.push(newClient);

        const registerRequests = payload.petsToRegister.map(pet =>
          this.registerPet$(pet, newClient.id!)
        );

        const adoptRequests = payload.petsToAdopt.map(pet =>
          this.changePetClientId$(pet, newClient.id!)
        );

        const allRequests = [...registerRequests, ...adoptRequests];

        return allRequests.length ? forkJoin(allRequests) : of(null);
      })

    ).subscribe({
      next: () => {
        this.showDialog = false;
      },
      error: err => {
        console.error(err);
      }
    });
  }

  // onStateChange(client: Client) {

  //   if (!client.id) return;

  //   const payload: Client = {
  //     docNum: client.docNum,
  //     docType: client.docType,
  //     fullName: client.fullName,
  //     phone: client.phone,
  //     address: client.address,
  //     state: client.state,

  //     petsCount: client.petsCount,
  //   }
    
  //   this.updateClient(client.id, payload);
  // }


  // displayCreatePopup: boolean = false
  // displayUpdatePopup: boolean = false
  // displaySelectPopup: boolean = false

  //toggle popups

  // toggleCreatePopup() {
  //   this.displayCreatePopup = true
  // }

  // toggleUpdatePopup(client: Client) {
  //   this.selected = client
  //   this.displayUpdatePopup = true
  // }

  // toggleSelectPopup(client: Client) {
  //   this.selected = client
  //   this.displaySelectPopup = true
  // }

  // toggleDeletePopup(client: Client) {
  //   if (!client.id) return

  //   this.deleteClient(client.id)
  // }

  // confirmations

  // onConfirmCreate(client: Client) {
  //   this.createClient(client)
  //   this.showDialog = false

  //   this.messageService.add({severity: 'success', detail: 'Client creado correctamente.', life: 2000});
  // }

  // onConfirmUpdate(client: Client) {
  //   if (!this.selected!.id) return

  //   this.updateClient(this.selected!.id, client)
  //   this.showDialog = false

  //   this.messageService.add({severity: 'success', detail: 'Client editado correctamente.', life: 2000});

  // }  

  confirmStateChange(client: Client) {

    const nextState = client.state === 'alta' ? 'baja' : 'alta';

    this.confirmationService.confirm({
      header: 'Confirmar acción',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',

      acceptButtonStyleClass: 'btn',
      rejectButtonStyleClass: 'cancel',

      message: `
        <strong>${client.fullName}</strong><br>
        ${client.docType}: ${client.docNum}<br><br>
        ¿Desea dar de <b>${nextState}</b> este cliente?
      `,
      accept: () => {
        this.applyStateChange(client, nextState);
      }
    });
  }

  private applyStateChange(client: Client, nextState: 'alta' | 'baja') {
    if (!client.id) return;
    
    this.clientService.updateState(client.id, nextState).subscribe(updatedClient => {

      const index = this.clients.findIndex(c => c.id === client.id);
      if (index !== -1) {
        this.clients[index] = updatedClient;
      }
      
      this.messageService.add({
      severity: 'success',
      summary: 'Estado actualizado',
      detail: `El cliente fue dado de ${nextState}`,
      life: 2500
    });
    })
  }

}
