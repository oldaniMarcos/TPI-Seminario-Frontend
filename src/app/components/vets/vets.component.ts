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
import { DialogModule } from 'primeng/dialog';
import { VetsDialogComponent } from "./vets-dialog/vets-dialog.component";

@Component({
  selector: 'app-vets',
  standalone: true,
  imports: [CommonModule, VetsTableComponent, RouterLink, ConfirmDialogModule, ToastModule, FormsModule, DialogModule, VetsDialogComponent],
  templateUrl: './vets.component.html',
  styleUrl: './vets.component.scss'
})
export class VetsComponent {
  showDialog: boolean = false;
  dialogTitle: string = '';
  selectedVeterinary: Veterinary | null = null;
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

  newVeterinary() {
    this.selectedVeterinary = null;
    this.dialogTitle = 'Nuevo Veterinario';
    this.showDialog = true;
  }

  editVeterinary(vet: Veterinary) {
    
    this.selectedVeterinary = vet;
    this.dialogTitle = 'Editar Veterinario';
    this.showDialog = true;
  }

  onSave(data: Veterinary) {
    if (this.selectedVeterinary) {

      this.vetService.patch(this.selectedVeterinary.id!, data).subscribe(() => {
        const index = this.vets.findIndex(p => p.id === this.selectedVeterinary!.id);
        if (index !== -1) {
          this.vets[index] = { ...this.selectedVeterinary!, ...data };
        }
        this.showDialog = false;
      });
    } else {

      this.vetService.post(data).subscribe((vet) => {
        this.vets.push(vet);
        this.showDialog = false;
      });
    }
  }

  onCancel() {
    this.showDialog = false;
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
        ID ${vet.id} - Mat. ${vet.licenseNumber}<br>
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
