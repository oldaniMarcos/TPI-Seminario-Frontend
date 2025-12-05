import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { VetsTableComponent } from './vets-table/vets-table.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { Veterinary } from '../../../types';
import { VeterinaryService } from '../../services/veterinary.service';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-vets',
  standalone: true,
  imports: [CommonModule, VetsTableComponent, RouterLink, ConfirmDialogModule, ToastModule, FormsModule],
  templateUrl: './vets.component.html',
  styleUrl: './vets.component.scss'
})
export class VetsComponent {
  vets: Veterinary[] = []

  constructor(
    private vetService: VeterinaryService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.findVets()
  }

  findVets(): void {
    this.vetService.findAll().subscribe(
      (data: Veterinary[]) => {
        this.vets = data
      },
    );
  }

  confirmStateChange(vet: Veterinary) {

    const nextState = vet.state === 'alta' ? 'baja' : 'alta';

      this.confirmationService.confirm({
      header: 'Confirmar acción',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',

      acceptButtonStyleClass: 'btn',
      rejectButtonStyleClass: 'cancel',

      message: `
        <strong>${vet.fullName}</strong><br>
        ${vet.docType} ${vet.docNum}<br>
        ¿Desea dar de <b>${nextState}</b> a este veterinario?
      `,
      accept: () => {
        this.applyStateChange(vet, nextState);
      }
    });
  }

  private applyStateChange(vet: Veterinary, nextState: 'alta' | 'baja') {
    if (!vet.id) return;
    
    this.vetService.updateState(vet.id, nextState).subscribe(updatedVeterinary => {

      const index = this.vets.findIndex(p => p.id === vet.id);
      if (index !== -1) {
        this.vets[index] = updatedVeterinary;
      }
      
      this.messageService.add({
      severity: 'success',
      summary: 'Estado actualizado',
      detail: `El veterinario fue dado de ${nextState}`,
      life: 2500
    });
    })

  }
}
