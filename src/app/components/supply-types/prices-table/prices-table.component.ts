import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SupplyPrice } from '../../../../types';

@Component({
  selector: 'app-prices-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './prices-table.component.html',
  styleUrl: './prices-table.component.scss'
})
export class PricesTableComponent {

  @Input() prices: SupplyPrice[] = []
}
