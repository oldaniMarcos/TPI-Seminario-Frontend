import { Component } from '@angular/core';
import { SupplyPrice } from '../../../../types';
import { SupplyPriceService } from '../../../services/supply-price.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PricesTableComponent } from '../prices-table/prices-table.component';

@Component({
  selector: 'app-prices',
  standalone: true,
  imports: [PricesTableComponent, RouterLink],
  templateUrl: './prices.component.html',
  styleUrl: './prices.component.scss'
})
export class PricesComponent {
  supplyPrices: SupplyPrice[] = []
  supplyTypeId = 0

  constructor(
    private supplyPriceService: SupplyPriceService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.supplyTypeId = Number(this.route.snapshot.paramMap.get('id'));
    this.findPricesById()
  }

  findPricesById(): void {
    this.supplyPriceService.findTypes(this.supplyTypeId).subscribe(
      (data: SupplyPrice[]) => {
        this.supplyPrices = data
      },
    );
  }
}
