import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { WithdrawalsTableComponent } from './withdrawals-table/withdrawals-table.component';
import { Withdrawal } from '../../../types';
import { MessageService, ConfirmationService } from 'primeng/api';
import { WithdrawalService } from '../../services/withdrawal.service';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { CashFlowService } from '../../services/cash-flow.service';
import { WithdrawalsDialogComponent } from './withdrawals-dialog/withdrawals-dialog.component';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-withdrawals',
  standalone: true,
  imports: [RouterLink, ConfirmDialogModule, MessageModule, ToastModule, WithdrawalsTableComponent, CommonModule, WithdrawalsDialogComponent, DialogModule], 
  templateUrl: './withdrawals.component.html',
  styleUrl: './withdrawals.component.scss'
})
export class WithdrawalsComponent {

  withdrawals: Withdrawal[] = []
  cashRegisterOpen: boolean = true;
  currentCashRegisterId: number | null = null;
  selectedWithdrawal: Withdrawal | null = null;
  showDialog: boolean = false;
  dialogTitle: string = '';

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private withdrawalService: WithdrawalService,
    private cashFlowService: CashFlowService,
    private datePipe: DatePipe,
    private currencyPipe: CurrencyPipe,
  ) { }

  ngOnInit() {

    this.checkCashRegisterState();
    this.withdrawalService.findAllPending().subscribe((data: Withdrawal[]) => {
      this.withdrawals = data;
    });
  }

  newWithdrawal() {
    this.selectedWithdrawal = null;
    this.dialogTitle = 'Nuevo Egreso';
    this.showDialog = true;
  }

  onSave(data: Withdrawal) {

    const withdrawal: Withdrawal = {
      ...data,
      cashFlowId: this.currentCashRegisterId!,
    };

    this.withdrawalService.post(withdrawal).subscribe((data: Withdrawal) => {
      this.withdrawals.push(data);
      this.showDialog = false;
    });
  }

  onCancel() {
    this.showDialog = false;
  }

  checkCashRegisterState(): void {
    this.cashFlowService.findLatest().subscribe(
      (data) => {
        
        this.cashRegisterOpen = data.closeType === '' && data.closeDate === null;

        if (this.cashRegisterOpen) {
          this.currentCashRegisterId = data.id!;          
        }
        
      }
    );
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
