import { Component } from '@angular/core';
import { PastDueTableComponent } from './past-due-table/past-due-table.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { RouterLink } from '@angular/router';
import { Client } from '../../../types';
import { ClientService } from '../../services/client.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-past-due-clients',
  standalone: true,
  imports: [PastDueTableComponent, ConfirmDialogModule, ToastModule, MessageModule, RouterLink],
  templateUrl: './past-due-clients.component.html',
  styleUrl: './past-due-clients.component.scss'
})
export class PastDueClientsComponent {

  constructor(
    private clientService: ClientService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  clients: any[] = [];

  ngOnInit() {
    this.findAllPastDue()
  }

  findAllPastDue(): void {
    this.clientService.findAllPastDue().subscribe((data: any[]) => {

      this.clients = data

    });
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
      
      this.clientService.updateStateInstallment(client.id, nextState).subscribe(updatedClient => {
  
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
