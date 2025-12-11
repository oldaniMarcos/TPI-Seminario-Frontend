import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { WithdrawalsTableComponent } from './withdrawals-table/withdrawals-table.component';
import { Withdrawal } from '../../../types';
import { MessageService, ConfirmationService } from 'primeng/api';
import { WithdrawalService } from '../../services/withdrawal.service';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-withdrawals',
  standalone: true,
  imports: [RouterLink, ConfirmDialogModule, MessageModule, ToastModule, WithdrawalsTableComponent],
  templateUrl: './withdrawals.component.html',
  styleUrl: './withdrawals.component.scss'
})
export class WithdrawalsComponent {

  withdrawals: Withdrawal[] = []

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private withdrawalService: WithdrawalService,
    private datePipe: DatePipe,
    private currencyPipe: CurrencyPipe
  ) { }

  ngOnInit() {
    this.withdrawalService.findAllPending().subscribe((data: Withdrawal[]) => {
      this.withdrawals = data;
    });
  }

  confirmCancel(withdrawal: Withdrawal) {

      const formattedDate = this.datePipe.transform(
        withdrawal.dateTime,
        'medium'
      );

      const formattedAmount = this.currencyPipe.transform(
        withdrawal.amount,
        '',     // o 'USD'
        'symbol',  // muestra el símbolo
        '1.2-2'    // formato
      );
        
      this.confirmationService.confirm({
        header: 'Confirmar acción',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Confirmar',
        rejectLabel: 'Cancelar',
  
        acceptButtonStyleClass: 'btn',
        rejectButtonStyleClass: 'cancel',
  
        message: `
          <strong>${withdrawal.description}</strong><br>
          ${formattedDate} - ${formattedAmount}<br><br>
          ¿Cancelar egreso?
        `,
        accept: () => {
          this.cancel(withdrawal);
        }
      });
    }
  
    private cancel(withdrawal: Withdrawal) {
      if (!withdrawal.id) return;
      
      this.withdrawalService.delete(withdrawal.id).subscribe(() => {

        this.messageService.add({
          severity: 'success',
          summary: 'Eliminado',
          detail: `El egreso fue eliminado correctamente.`,
          life: 2500
        });
        this.withdrawals = this.withdrawals.filter(w => w.id !== withdrawal.id);
      })
    }
}
