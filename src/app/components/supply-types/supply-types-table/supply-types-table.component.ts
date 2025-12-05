import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SupplyType } from '../../../../types';
import { Router } from '@angular/router';

@Component({
  selector: 'app-supply-types-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './supply-types-table.component.html',
  styleUrl: './supply-types-table.component.scss'
})
export class SupplyTypesTableComponent {

  constructor(
    private router: Router
  ) {}

  @Input() supplyTypes: SupplyType[] = []

  goToLots(supplyTypeId: number) {
    this.router.navigate(['/types', supplyTypeId, 'lots'])
  }

  goToPrices(supplyTypeId: number) {
    this.router.navigate(['/types', supplyTypeId, 'prices'])
  }

  onEdit(supplyType: SupplyType) {
    console.log('WIP...', supplyType);
  }
}
