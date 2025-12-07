import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Installment } from '../../../../types';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-installments-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './installments-table.component.html',
  styleUrl: './installments-table.component.scss'
})
export class InstallmentsTableComponent {

  @Input() client: any = null

  @Output() payInstallmentEvent = new EventEmitter<Installment>();

  getNextPayableInstallmentId(): number | null {
    if (!this.client?.installments) return null;

    const next = this.client.installments.find((i: Installment) => !i.payDate);
    return next ? next.id : null;
  }

  payInstallment(inst: Installment) {
    console.log("Pagar cuota:", inst);
    this.payInstallmentEvent.emit(inst)
  }

  isInstallmentPayable(i: Installment): boolean {
    if (!i) return false;

    const today = new Date();
    const due = new Date(i.dueDate);

    // Fecha un mes en el futuro
    const oneMonthAhead = new Date();
    oneMonthAhead.setMonth(oneMonthAhead.getMonth() + 1);

    return (
      !i.payDate && // sin pagar
      (due < today || due <= oneMonthAhead)
    );
  }

}
