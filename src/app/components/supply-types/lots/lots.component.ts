import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LotsTableComponent } from '../lots-table/lots-table.component';
import { Lot } from '../../../../types';
import { LotService } from '../../../services/lot.service';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-lots',
  standalone: true,
  imports: [CommonModule, LotsTableComponent, RouterLink],
  templateUrl: './lots.component.html',
  styleUrl: './lots.component.scss'
})
export class LotsComponent {

  lots: Lot[] = []
  supplyTypeId = 0
  
    constructor(
      private lotService: LotService,
      private route: ActivatedRoute
    ) { }
  
    ngOnInit() {
      this.supplyTypeId = Number(this.route.snapshot.paramMap.get('id'));
      this.findLotsById()
    }
  
    findLotsById(): void {
      this.lotService.findBySupplyTypeId(this.supplyTypeId).subscribe(
        (data: Lot[]) => {
          this.lots = data
        },
      );
    }
}
