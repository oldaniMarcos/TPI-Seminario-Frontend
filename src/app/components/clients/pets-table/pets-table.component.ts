import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Pet } from '../../../../types';

@Component({
  selector: 'app-pets-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pets-table.component.html',
  styleUrl: './pets-table.component.scss'
})
export class PetsTableComponent {
  @Input() pets: Pet[] = []

  @Output() stateChangeRequest = new EventEmitter<Pet>()

  onEdit(pet: Pet) {
    console.log('WIP...', pet);
  }

  requestStateChange(pet: Pet) {
    this.stateChangeRequest.emit(pet)
  }
}
