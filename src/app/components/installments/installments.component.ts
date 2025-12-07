import { Component } from '@angular/core';
import { Client, Installment } from '../../../types';
import { ClientService } from '../../services/client.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { InstallmentsTableComponent } from './installments-table/installments-table.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { InstallmentService } from '../../services/installment.service';

@Component({
  selector: 'app-installments',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, InstallmentsTableComponent, ConfirmDialogModule, ToastModule],
  templateUrl: './installments.component.html',
  styleUrl: './installments.component.scss'
})
export class InstallmentsComponent {
  client: any = ''

  dniFilter: string = '';
  docTypeFilter: string = 'DNI';
  clientValid = false;
  invalidDocMessage = '';
  clientDeactivatedMessage = '';
  noPaymentsDueMessage = '';


  constructor(
    private clientService: ClientService,
    private installmentService: InstallmentService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  findClient(): void {
    this.clientService.findByDoc(this.docTypeFilter, this.dniFilter)
    .subscribe({
      next: (client) => {

        if (client == null) {
          this.client = null;
          this.clientValid = false;
          this.invalidDocMessage = 'Cliente no encontrado';
          this.clientDeactivatedMessage = '';
          this.noPaymentsDueMessage = '';
          return;
        }

        if (client.state == 'alta') {
          this.client = client ? client : null;
          if (this.client?.installments) {
            this.client.installments = this.client.installments.filter(
              (inst: { id: number | null }) => inst.id !== null
            );
          }
          if (this.client?.installments.length === 0) {
            this.noPaymentsDueMessage = 'El cliente no posee cuotas pendientes';
            this.clientValid = false;
            this.invalidDocMessage = '';
            this.clientDeactivatedMessage = '';
            return;
          }

          this.client.installments.sort((a: any, b: any) => {
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          });
          
          this.clientValid = true;
          this.invalidDocMessage = '';
          this.clientDeactivatedMessage = '';
          this.noPaymentsDueMessage = '';
          
        } else {
          this.client = null;
          this.clientValid = false;
          this.invalidDocMessage = '';
          this.clientDeactivatedMessage = 'El cliente se encuentra dado de baja';
          this.noPaymentsDueMessage = '';
        }
        
      },
      error: () => {
        this.client = null;
        this.clientValid = false;
        this.invalidDocMessage = 'Cliente no encontrado';
        this.clientDeactivatedMessage = '';
        this.noPaymentsDueMessage = '';
      }
    });
  }

  confirmPayment(inst: Installment) {

    this.confirmationService.confirm({
      header: 'Confirmar acción',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',

      acceptButtonStyleClass: 'btn',
      rejectButtonStyleClass: 'cancel',

      message: `
        Venc. ${inst.dueDate} - Total: $${inst.amount}<br><br>
        ¿Desea <b>pagar</b> esta cuota?
      `,
      accept: () => {
        this.payInstallment(inst);
      }
    });
  }

  payInstallment(inst: Installment) {
    this.installmentService.payInstallment(inst.id!).subscribe({
      next: updated => {
        inst.payDate = updated.payDate;

        this.messageService.add({
          severity: 'success',
          summary: 'Cuota pagada',
          detail: `Pago registrado correctamente`,
          life: 2500
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo registrar el pago',
          life: 2500
        });
      }
    });
  }

}
