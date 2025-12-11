import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Withdrawal } from '../../../../types';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-withdrawals-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './withdrawals-table.component.html',
  styleUrl: './withdrawals-table.component.scss'
})
export class WithdrawalsTableComponent {

  @Input() withdrawals: Withdrawal[] = []

  @Output() cancelRequest = new EventEmitter<Withdrawal>()

  onCancel(w: Withdrawal) {
    this.cancelRequest.emit(w)
  }
}
