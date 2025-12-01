import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cashflow-management',
  standalone: true,
  imports: [CommonModule, RouterLink],
  providers: [],
  templateUrl: './cashflow-management.component.html',
  styleUrl: './cashflow-management.component.scss'
})
export class CashflowManagementComponent {
}
