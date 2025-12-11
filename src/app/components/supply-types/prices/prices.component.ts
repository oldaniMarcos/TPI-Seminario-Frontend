import { Component } from '@angular/core';
import { SupplyPrice } from '../../../../types';
import { SupplyPriceService } from '../../../services/supply-price.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PricesTableComponent } from '../prices-table/prices-table.component';
import { PricesDialogComponent } from '../prices-dialog/prices-dialog.component';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-prices',
  standalone: true,
  imports: [PricesTableComponent, RouterLink, PricesDialogComponent, DialogModule],
  templateUrl: './prices.component.html',
  styleUrl: './prices.component.scss'
})
export class PricesComponent {
  supplyPrices: SupplyPrice[] = []
  supplyTypeId = 0
  showDialog: boolean = false;
  dialogTitle: string = '';
  selectedPrice: SupplyPrice | null = null;

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

  newPrice() {
    this.selectedPrice = null;
    this.dialogTitle = 'Nuevo Precio';
    this.showDialog = true;
  }

  onCancel() {
    this.showDialog = false;
  }

  onSave(data: SupplyPrice) {
    if (this.selectedPrice) {

      this.supplyPriceService.patch(this.selectedPrice.id!, data).subscribe(() => {
        const index = this.supplyPrices.findIndex(p => p.id === this.selectedPrice!.id);
        if (index !== -1) {
          this.supplyPrices[index] = { ...this.selectedPrice!, ...data };
        }
        this.showDialog = false;
      });
    } else {

      this.supplyPriceService.post(data).subscribe((price) => {
        this.supplyPrices.push(price);
        this.showDialog = false;
      });
    }
  }
}
