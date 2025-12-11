import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LotsTableComponent } from '../lots-table/lots-table.component';
import { Lot } from '../../../../types';
import { LotService } from '../../../services/lot.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { LotsDialogComponent } from '../lots-dialog/lots-dialog.component';

@Component({
  selector: 'app-lots',
  standalone: true,
  imports: [CommonModule, LotsTableComponent, RouterLink, ConfirmDialogModule, ToastModule, MessageModule, FormsModule, DialogModule, LotsDialogComponent],
  templateUrl: './lots.component.html',
  styleUrl: './lots.component.scss'
})
export class LotsComponent {

  lots: Lot[] = []
  supplyTypeId = 0
  showDialog: boolean = false;
  dialogTitle: string = '';
  selectedLot: Lot | null = null;

  constructor(
    private lotService: LotService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
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

  confirmDelete(lot: Lot) {
    this.confirmationService.confirm({
      header: 'Confirmar acción',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',

      acceptButtonStyleClass: 'btn',
      rejectButtonStyleClass: 'cancel',

      message: `
        Lote <strong>${lot.lotNumber}</strong><br>
        ¿Desea eliminar el lote?
      `,
      accept: () => {
        this.deleteLot(lot);
      }
    });
  }

  private deleteLot(lot: Lot) {
    if (!lot.id) return;
    
    this.lotService.delete(lot.id).subscribe(() => {

      this.lots = this.lots.filter(l => l.id !== lot.id);
      
      this.messageService.add({
      severity: 'success',
      summary: 'Eliminado',
      detail: `El lote fue eliminado.`,
      life: 2500
    });
    })

  }

  newLot() {
    this.selectedLot = null;
    this.dialogTitle = 'Nuevo Lote';
    this.showDialog = true;
  }

  editLot(lot: Lot) {
    this.selectedLot = lot;
    this.dialogTitle = 'Editar Lote';
    this.showDialog = true;
  }

  onCancel() {
    this.showDialog = false;
  }

  onSave(data: Lot) {
    if (this.selectedLot) {
      this.lotService.patch(this.selectedLot.id!, data).subscribe(() => {
        const index = this.lots.findIndex(p => p.id === this.selectedLot!.id);
        if (index !== -1) {
          this.lots[index] = { ...this.selectedLot!, ...data };
        }
        this.showDialog = false;
      });
    } else {

      this.lotService.post(data).subscribe((lot) => {
        this.lots.push(lot);
        this.showDialog = false;
      });
    }
  }

}
