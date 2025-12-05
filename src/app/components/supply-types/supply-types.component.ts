import { Component } from '@angular/core';
import { SupplyType } from '../../../types';
import { SupplyTypeService } from '../../services/supply-type.service';
import { RouterLink } from '@angular/router';
import { SupplyTypesTableComponent } from './supply-types-table/supply-types-table.component';

@Component({
  selector: 'app-supply-types',
  standalone: true,
  imports: [RouterLink, SupplyTypesTableComponent],
  templateUrl: './supply-types.component.html',
  styleUrl: './supply-types.component.scss'
})
export class SupplyTypesComponent {
  supplyTypes: SupplyType[] = []
  
    constructor(
      private supplyTypeService: SupplyTypeService,
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
}
