import { Component } from '@angular/core';
import { PetsTableComponent } from '../pets-table/pets-table.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Pet } from '../../../../types';
import { PetService } from '../../../services/pet.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../../services/client.service';
import { PetsDialogComponent } from '../pets-dialog/pets-dialog.component';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-pets',
  standalone: true,
  imports: [CommonModule, PetsTableComponent, RouterLink, ConfirmDialogModule, ToastModule, FormsModule, PetsDialogComponent, DialogModule],
  templateUrl: './pets.component.html',
  styleUrl: './pets.component.scss'
})
export class PetsComponent {

  pets: Pet[] = []
  clientId = 0
  clientDisabled: boolean = false;
  clientDisabledMessage: string = 'No se pueden gestionar mascotas para un cliente dado de baja.';
  showDialog: boolean = false;
  dialogTitle: string = ''
  selectedPet: Pet | null = null;
  
  constructor(
    private petService: PetService,
    private clientService: ClientService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.clientId = Number(this.route.snapshot.paramMap.get('id'));
    this.checkClientState();    
    this.findByClientId();
  }

  findByClientId(): void {
    this.petService.findByClientId(this.clientId).subscribe(
      (data: Pet[]) => {
        this.pets = data
      },
    );
  }

  checkClientState(): any {
    this.clientService.findOne(this.clientId).subscribe(
      (data) => {
        if (data.state === 'baja') {
          this.clientDisabled = true;
        } else {
          this.clientDisabled = false;
        }
      }
    );
  }

  newPet() {
    this.selectedPet = null;
    this.dialogTitle = 'Nueva Mascota';
    this.showDialog = true;
  }

  editPet(pet: Pet) {
    this.selectedPet = pet;
    this.dialogTitle = 'Editar Mascota';
    this.showDialog = true;
  }

  updatePet(id: number, pet: Pet): void {
    this.petService.patch(id, pet).subscribe(
      (updatedPet: Pet) => {
        const index = this.pets.findIndex(c => c.id === id);
        if (index > -1) this.pets[index] = updatedPet;
      },
    );
  }

  adoptPet(): void {
    this.router.navigate(['/client', this.clientId, 'adopt'])
  }

  confirmStateChange(pet: Pet) {

    const nextState = pet.state === 'alta' ? 'baja' : 'alta';

    this.clientService.findOne(pet.clientId).subscribe( (data) => {
      const clientName = data.fullName
      const docType = data.docType
      const docNum = data.docNum

      this.confirmationService.confirm({
      header: 'Confirmar acción',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',

      acceptButtonStyleClass: 'btn',
      rejectButtonStyleClass: 'cancel',

      //Has to show client doc and name
      message: `
        <strong>${pet.name}</strong><br>
        De <strong>${clientName}</strong><br>
        ${docType} ${docNum}<br>
        ¿Desea dar de <b>${nextState}</b> a esta mascota?
      `,
      accept: () => {
        this.applyStateChange(pet, nextState);
      }
    });
    })
  }
  
  private applyStateChange(pet: Pet, nextState: 'alta' | 'baja') {
    if (!pet.id) return;

    // const payload: Partial<Pet> = {
    //   state: nextState,
    // }
    
    this.petService.updateState(pet.id, nextState).subscribe(updatedPet => {

      const index = this.pets.findIndex(p => p.id === pet.id);
      if (index !== -1) {
        this.pets[index] = updatedPet;
      }
      
      this.messageService.add({
      severity: 'success',
      summary: 'Estado actualizado',
      detail: `La mascota fue dada de ${nextState}`,
      life: 2500
    });
    })

  }

  onSave(data: any) {
    if (this.selectedPet) {

      const updatedPet: Pet = {
        name: data.name,
        birthDate: data.birthDate,
        age: Math.floor((new Date().getTime() - new Date(data.birthDate).getTime()) / (1000 * 60 * 60 * 24 * 365.25)),
        state: data.state,
        breedId: data.breed,
        clientId: this.clientId,
      };

      this.petService.patch(this.selectedPet.id!, updatedPet).subscribe(() => {
        const index = this.pets.findIndex(p => p.id === this.selectedPet!.id);
        if (index !== -1) {
          this.pets[index] = { ...this.selectedPet!, ...data };
        }
        this.showDialog = false;

        // same as below
        this.findByClientId();
      });
    } else {

      const newPet: Pet = {
        name: data.name,
        birthDate: data.birthDate,
        age: Math.floor((new Date().getTime() - new Date(data.birthDate).getTime()) / (1000 * 60 * 60 * 24 * 365.25)),
        state: data.state,
        clientId: this.clientId,
        breedId: data.breed,
      };

      this.petService.post(newPet).subscribe((pet) => {
        this.pets.push(pet);
        this.showDialog = false;

        // refresh list so it shows species and breed, could be more efficient
        this.findByClientId();
      });
      
    }
  }

  onCancel() {
    this.showDialog = false;
  }
}
