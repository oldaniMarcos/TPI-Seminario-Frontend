import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Client } from '../../../../types';
import { Router } from '@angular/router';

@Component({
  selector: 'app-clients-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clients-table.component.html',
  styleUrl: './clients-table.component.scss',
})
export class ClientsTableComponent {

  constructor(
    private router: Router
  ) {}

  @Input() clients: Client[] = [];

  @Output() edit = new EventEmitter<Client>();
  @Output() stateChange = new EventEmitter<Client>();
  @Output() stateChangeRequest = new EventEmitter<Client>();

  onEdit(client: Client) {
    this.edit.emit(client);
  }

  onDeactivate(client: Client) {
    this.updateState(client, 'baja');
  }

  onActivate(client: Client) {
    this.updateState(client, 'alta');
  }

  requestStateChange(client: Client) {
    this.stateChangeRequest.emit(client);
  }

  private updateState(client: Client, newState: 'alta' | 'baja') {
    this.stateChange.emit({
      ...client,
      state: newState
    });
  }

  goToPets(clientId: number) {
    this.router.navigate(['/client', clientId, 'pets'])
  }

}
