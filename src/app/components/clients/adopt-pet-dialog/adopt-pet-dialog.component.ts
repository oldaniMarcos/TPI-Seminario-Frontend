import { Component, EventEmitter, Output } from '@angular/core';
import { Pet } from '../../../../types';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ClientService } from '../../../services/client.service';
import { InstallmentService } from '../../../services/installment.service';
import { PetService } from '../../../services/pet.service';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { PetsTableComponent } from '../pets-table/pets-table.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-adopt-pet-dialog',
  standalone: true,
  imports: [CommonModule, ConfirmDialogModule, PetsTableComponent, ToastModule, FormsModule],
  templateUrl: './adopt-pet-dialog.component.html',
  styleUrl: './adopt-pet-dialog.component.scss'
})
export class AdoptPetDialogComponent {


  @Output() cancel = new EventEmitter<void>();

  adoptingClientId: number = 0;
  dniFilter: string = '';
  docTypeFilter: string = 'DNI';
  clientValid = false;
  invalidDocMessage = '';
  clientDeactivatedMessage = '';
  noPetsMessage = '';
  sameClientMessage = '';
  clientDataMessage = '';
  pets: Pet[] = [];

  constructor(
    private clientService: ClientService,
    private petService: PetService,
    private installmentService: InstallmentService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() { 
    this.adoptingClientId = Number(this.route.snapshot.paramMap.get('id'));
  }

  onCancel() {
    this.cancel.emit();
  }

  findPetsByClientId(id: number, clientFullName: string): void {
    this.petService.findByClientId(id).subscribe(
      (data: Pet[]) => {

        this.pets = data;

        if (this.pets.length === 0) {
          this.noPetsMessage = 'El cliente no posee mascotas para adoptar';
          this.invalidDocMessage = '';
          this.clientDeactivatedMessage = '';
          this.sameClientMessage = '';
          this.clientDataMessage = ``;
        } else {
          this.clientValid = true;
          this.noPetsMessage = '';
          this.invalidDocMessage = '';
          this.clientDeactivatedMessage = '';
          this.sameClientMessage = '';
          this.clientDataMessage = `Mascotas de ${clientFullName}`;
        }
      },
    );
  }

  findClient(): void {
    this.clientService.findByDoc(this.docTypeFilter, this.dniFilter)
    .subscribe({
      next: (client) => { 

        if (client == null) {
          this.clientValid = false;
          this.invalidDocMessage = 'Cliente no encontrado';
          this.clientDeactivatedMessage = '';
          this.noPetsMessage = '';
          this.sameClientMessage = '';
          this.clientDataMessage = ``;

          return;
        }

        if (client.id === this.adoptingClientId) {
          this.clientValid = false;
          this.invalidDocMessage = '';
          this.clientDeactivatedMessage = '';
          this.noPetsMessage = '';
          this.sameClientMessage = 'No se puede adoptar una mascota del mismo cliente';
          this.clientDataMessage = ``

          return;
        }

        this.findPetsByClientId(client.id, client.fullName);

      },
      error: () => {
        this.clientValid = false;
        this.invalidDocMessage = 'Cliente no encontrado';
        this.clientDeactivatedMessage = '';
        this.noPetsMessage = '';
        this.sameClientMessage = '';
        this.clientDataMessage = ``
      }
    });
  }

  adoptPet(pet: Pet): void {
    
    this.confirmationService.confirm({

      header: 'Confirmar acción',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',

      acceptButtonStyleClass: 'btn',
      rejectButtonStyleClass: 'cancel',

      message: `
        <b>${pet.name}</b><br>
        ${pet.speciesName} - ${pet.breedName}<br><br>
        ¿Desea <b>adoptar</b> esta mascota?
      `,
      accept: () => {
        
        this.changePetClientId(pet, this.adoptingClientId)
        
      }
    });
  }

  changePetClientId(pet: Pet, adoptingClientId: number): void {

    const updatedPet: Pet = {
      name: pet.name,
      age: pet.age,
      birthDate: pet.birthDate,
      state: pet.state,
      breedId: pet.breedId,
      clientId: adoptingClientId,
    };

    this.petService.patch(pet.id!, updatedPet).subscribe(
      (updatedPet: Pet) => {
        this.messageService.add({severity:'success', summary:'Éxito', detail:`La mascota ${updatedPet.name} ha sido adoptada correctamente.`});
        this.router.navigate(['/client', this.adoptingClientId, 'pets']);
      }
    );
  }
}
