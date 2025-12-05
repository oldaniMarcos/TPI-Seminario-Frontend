import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Veterinary } from '../../../../types';

@Component({
  selector: 'app-vets-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vets-table.component.html',
  styleUrl: './vets-table.component.scss'
})
export class VetsTableComponent {
  @Input() vets: Veterinary[] = []

  @Output() stateChangeRequest = new EventEmitter<Veterinary>()

  onEdit(vet: Veterinary) {
    console.log('WIP...', vet);
  }

  requestStateChange(vet: Veterinary) {
    this.stateChangeRequest.emit(vet)
  }
}
