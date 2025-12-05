import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
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

  onEdit(lot: Lot) {
    console.log('WIP...', lot);
  }

  onDelete(lot: Lot) {
    console.log('WIP...', lot);
  }
}
