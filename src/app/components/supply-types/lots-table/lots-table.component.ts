import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Lot } from '../../../../types';

@Component({
  selector: 'app-lots-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lots-table.component.html',
  styleUrl: './lots-table.component.scss'
})
export class LotsTableComponent {

  @Input() lots: Lot[] = []
  @Input() supplyTypeId: number = 0;

  @Output() edit = new EventEmitter<Lot>();
  @Output() delete = new EventEmitter<Lot>();

  onEdit(lot: Lot) {
    lot.supplyTypeId = this.supplyTypeId;
    this.edit.emit(lot);
  }

  onDelete(lot: Lot) {
    this.delete.emit(lot);
  }
}
