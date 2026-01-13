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
  @Input() adoptMode: boolean = false;
  @Input() clientDisabled: boolean = false;

  @Output() stateChangeRequest = new EventEmitter<Pet>()
  @Output() adoptRequest = new EventEmitter<Pet>()
  @Output() editRequest = new EventEmitter<Pet>()

  onEdit(pet: Pet) {
    this.editRequest.emit(pet)
  }

  onAdopt(pet: Pet) {
    this.adoptRequest.emit(pet)
    // console.log(pet);
  }

  requestStateChange(pet: Pet) {
    this.stateChangeRequest.emit(pet)
  }
}
