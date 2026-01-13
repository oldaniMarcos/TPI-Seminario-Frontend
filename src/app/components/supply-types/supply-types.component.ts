import { Component } from '@angular/core';
import { Lot, SupplyPrice, SupplyType } from '../../../types';
import { SupplyTypeService } from '../../services/supply-type.service';
import { RouterLink } from '@angular/router';
import { SupplyTypesTableComponent } from './supply-types-table/supply-types-table.component';
import { SupplyTypesDialogComponent } from './supply-types-dialog/supply-types-dialog.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { LotService } from '../../services/lot.service';
import { SupplyPriceService } from '../../services/supply-price.service';
import { forkJoin, switchMap } from 'rxjs';

@Component({
  selector: 'app-supply-types',
  standalone: true,
  imports: [RouterLink, SupplyTypesTableComponent, SupplyTypesDialogComponent, ConfirmDialogModule, ToastModule, MessageModule, FormsModule, DialogModule],
  templateUrl: './supply-types.component.html',
  styleUrl: './supply-types.component.scss'
})
export class SupplyTypesComponent {

  supplyTypes: SupplyType[] = []
  supplyTypeId = 0
  showDialog: boolean = false;
  dialogTitle: string = '';
  selectedSupplyType: SupplyType | null = null;
  
  constructor(
    private supplyTypeService: SupplyTypeService,
    private lotService: LotService,
    private supplyPriceService: SupplyPriceService
  ) { }

  ngOnInit() {
    this.findSupplyTypes()
  }

  findSupplyTypes(): void {
    this.supplyTypeService.findAll().subscribe(
      (data: SupplyType[]) => {
        this.supplyTypes = data
      },
    );
  }

  newType() {
    this.dialogTitle = 'Nuevo tipo de insumo';
    this.selectedSupplyType = null;
    this.showDialog = true;
  }

  onCancel() {
    this.showDialog = false;
  }

  onSave(data: any) {
    if (this.selectedSupplyType) {

      this.supplyTypeService
        .patch(this.selectedSupplyType.id!, { description: data.description })
        .subscribe((updated) => {

        const index = this.supplyTypes.findIndex(
          s => s.id === this.selectedSupplyType!.id
        );
        
        if (index !== -1) {
          this.supplyTypes[index] = {
            ...this.selectedSupplyType!,
            description: updated.description
          };
        }

        this.showDialog = false;
      });

      return;
    }

    this.supplyTypeService.post({ description: data.description })
    .pipe(
      switchMap(supplyType => {

        const lot: Lot = {
          lotNumber: data.lotNumber,
          dueDate: data.dueDate,
          units: data.units,
          supplyTypeId: supplyType.id!
        };

        const price: SupplyPrice = {
          beginDate: data.beginDate,
          currency: data.currency,
          price: data.price,
          supplyTypeId: supplyType.id!
        };

        return forkJoin([
          this.lotService.post(lot),
          this.supplyPriceService.post(price)
        ]);
      })
    )
    .subscribe({
      next: () => {
        this.findSupplyTypes();
        this.showDialog = false;
      }
    });

  }

  onEdit(supplyType: SupplyType) {
    this.dialogTitle = 'Editar tipo de insumo';
    this.selectedSupplyType = supplyType;
    this.showDialog = true;
  }
}
