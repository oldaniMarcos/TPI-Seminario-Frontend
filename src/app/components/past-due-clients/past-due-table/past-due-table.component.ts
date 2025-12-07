import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Client } from '../../../../types';

@Component({
  selector: 'app-past-due-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './past-due-table.component.html',
  styleUrl: './past-due-table.component.scss'
})
export class PastDueTableComponent {
  
  constructor(
      private router: Router
    ) {}
  
    @Input() clients: any[] = [];
  
    @Output() edit = new EventEmitter<any>();
    @Output() stateChange = new EventEmitter<any>();
    @Output() stateChangeRequest = new EventEmitter<any>();
  
    requestStateChange(client: Client) {
      this.stateChangeRequest.emit(client);
    }
}
