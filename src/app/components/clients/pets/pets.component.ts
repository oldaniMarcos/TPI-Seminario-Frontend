import { Component } from '@angular/core';
import { PetsTableComponent } from '../pets-table/pets-table.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Pet } from '../../../../types';
import { PetService } from '../../../services/pet.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../../services/client.service';

@Component({
  selector: 'app-pets',
  standalone: true,
  imports: [CommonModule, PetsTableComponent, RouterLink, ConfirmDialogModule, ToastModule, FormsModule],
  templateUrl: './pets.component.html',
  styleUrl: './pets.component.scss'
})
export class PetsComponent {

  pets: Pet[] = []
  clientId = 0
  
  constructor(
    private petService: PetService,
    private clientService: ClientService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.clientId = Number(this.route.snapshot.paramMap.get('id'));
    this.findByClientId()
  }

  findByClientId(): void {
    this.petService.findByClientId(this.clientId).subscribe(
      (data: Pet[]) => {
        this.pets = data
      },
    );
  }

  updatePet(id: number, pet: Pet): void {
    this.petService.patch(id, pet).subscribe(
      (updatedPet: Pet) => {
        const index = this.pets.findIndex(c => c.id === id);
        if (index > -1) this.pets[index] = updatedPet;
      },
    );
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
}
