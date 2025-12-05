import { Component } from '@angular/core';
import { Client } from '../../../types';
import { ClientService } from '../../services/client.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { ClientsTableComponent } from './clients-table/clients-table.component';
import { RouterLink } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';


@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastModule, ClientsTableComponent, RouterLink, ConfirmDialogModule],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss'
})
export class ClientsComponent {
  clients: Client[] = []
  selected: Client = {
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

  constructor(
    private clientService: ClientService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
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

  createClient(client: Client): void {
  this.clientService.post(client).subscribe(
    (newClient: Client) => {
      this.clients.push(newClient); 
    },
  );
  }

  updateClient(id: number, client: Client): void {
    this.clientService.patch(id, client).subscribe(
      (updatedClient: Client) => {
        const index = this.clients.findIndex(c => c.id === id);
        if (index > -1) this.clients[index] = updatedClient;
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

  onStateChange(client: Client) {

    if (!client.id) return;

    const payload: Client = {
      docNum: client.docNum,
      docType: client.docType,
      fullName: client.fullName,
      phone: client.phone,
      address: client.address,
      state: client.state,

      petsCount: client.petsCount,
    }
    
    this.updateClient(client.id, payload);
  }


  displayCreatePopup: boolean = false
  displayUpdatePopup: boolean = false
  displaySelectPopup: boolean = false

  //toggle popups

  toggleCreatePopup() {
    this.displayCreatePopup = true
  }

  toggleUpdatePopup(client: Client) {
    this.selected = client
    this.displayUpdatePopup = true
  }

  toggleSelectPopup(client: Client) {
    this.selected = client
    this.displaySelectPopup = true
  }

  toggleDeletePopup(client: Client) {
    if (!client.id) return

    this.deleteClient(client.id)
  }

  // confirmations

  onConfirmCreate(client: Client) {
    this.createClient(client)
    this.displayCreatePopup = false

    this.messageService.add({severity: 'success', detail: 'Client creado correctamente.', life: 2000});
  }

  onConfirmUpdate(client: Client) {
    if (!this.selected.id) return

    this.updateClient(this.selected.id, client)
    this.displayUpdatePopup = false

    this.messageService.add({severity: 'success', detail: 'Client editado correctamente.', life: 2000});

  }  

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
