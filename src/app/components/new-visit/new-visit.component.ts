import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PetService } from '../../services/pet.service';
import { ClientService } from '../../services/client.service';
import { PetWithClient } from '../../../types';
import { catchError, debounceTime, distinctUntilChanged, filter, of, switchMap, tap, Subscription } from 'rxjs';
import { VeterinaryService } from '../../services/veterinary.service';
import { SupplyTypeService } from '../../services/supply-type.service';
import { CheckboxModule } from 'primeng/checkbox';
import { ProfitMarginService } from '../../services/profit-margin.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-new-visit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FloatLabelModule, InputTextModule, DropdownModule, DialogModule, CheckboxModule, ConfirmDialogModule],
  templateUrl: './new-visit.component.html',
  styleUrl: './new-visit.component.scss'
})
export class NewVisitComponent {

  @Output() save = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  form!: FormGroup;

  get supplies(): FormArray {
    return this.form.get('supplies') as FormArray;
  }

  clientDisabled: boolean = false;
  petDisabled: boolean = false;
  petIdInvalid: boolean = false;
  clientDataMessage: string = '';

  vetsOptions: any[] = [];
  supplyOptions: any[] = [];

  private supplySubscriptions: Subscription[] = [];

  showContinueDialog: boolean = false;

  suppliesSummary: any[] = []; // later from backend
  payInInstallments = false;

  profitMarginMult = 1;

  totalSuppliesCost = 0;
  totalVisitCost = 0;
  total = 0;

  installmentValue = 0;
  firstPayDate = '';
  dueDate = '';

  constructor(
    private fb: FormBuilder,
    private petService: PetService,
    private clientService: ClientService,
    private vetService: VeterinaryService,
    private supplyTypeService: SupplyTypeService,
    private profitMarginService: ProfitMarginService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {}

  ngOnInit(): void {

    this.form = this.fb.group({
      petId:          ['', Validators.required],
      vetId:          ['', Validators.required],
      diagnostic:    ['', [Validators.maxLength(255), Validators.required]],
      supplies:     this.fb.array([this.createSupply()]),

      visitValue:  [0, [Validators.required, Validators.min(0)]],
      payInInstallments: [false]
    });

    // attach subscribers for existing supplies (initial one)
    this.supplies.controls.forEach(ctrl => this.attachSupplySubscriber(ctrl as FormGroup));

    this.vetService.findAll().subscribe({
      next: (vets) => {
        this.vetsOptions = vets.map(vet => ({
        label: `${vet.fullName} - Mat. ${vet.licenseNumber}`,
        value: vet.id
      }));
      }
    });

    this.supplyTypeService.findAllWithActiveUnits().subscribe({
      next: (supplyTypes) => {
        this.supplyOptions = supplyTypes.map(supplyType => ({
          label: `${supplyType.description} (${supplyType.totalUnits}u. disp.)`,
          value: supplyType.id,
          units: supplyType.totalUnits || 0,
          name: supplyType.description,
          price: supplyType.currentPrice || 0,
        }));

        this.supplyOptions = this.supplyOptions.filter(opt => opt.units > 0);
        
      }
    });

    this.profitMarginService.findLatest().subscribe({
      next: (margin) => {
        this.profitMarginMult = margin.mult;        
      }
    });

    this.form.get('petId')!
    .valueChanges
    .pipe(
      debounceTime(500),                 
      distinctUntilChanged(),
      tap(() => this.resetMessages()),
      filter(value => !!value && value > 0), 
      switchMap(petId => {
        this.resetMessages();
        return this.petService
          .findOne<PetWithClient>(petId)
          .pipe(catchError(() => of(null)));
      })
    )
    .subscribe(pet => {
      if (!pet) {
        this.petIdInvalid = true;
        return;
      }

      if (pet.state === 'baja') {
        this.petDisabled = true;
        return;
      }

      if (pet.client?.state === 'baja') {
        this.clientDisabled = true;
        return;
      }

      this.clientDataMessage =
        `${pet.client.fullName} - ${pet.client.docType} ${pet.client.docNum}`;
    });

  }

  createSupply(): FormGroup {
    return this.fb.group({
      supplyTypeId: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
  }

  addSupply(): void {

    if (!this.canAddSupply()) return;

    const group = this.createSupply();
    this.supplies.push(group);
    this.attachSupplySubscriber(group);
  }

  removeSupply(): void {
    if (this.supplies.length === 1) return;
    this.supplies.removeAt(this.supplies.length - 1);
    const sub = this.supplySubscriptions.pop();
    sub?.unsubscribe();
  }

  getFilteredSupplyOptions(index: number): any[] {
    const selectedIds = this.supplies.controls
      .map(ctrl => ctrl.get('supplyTypeId')?.value)
      .filter(v => v !== null && v !== undefined);

    const currentValue = this.supplies.at(index).get('supplyTypeId')?.value;

    return this.supplyOptions.filter(opt => {
      if (opt.value === currentValue) return true;

      return !selectedIds.includes(opt.value);
    });
  }

  canAddSupply(): boolean {
    if (!this.supplyOptions?.length) return false;

    return this.supplies.length < this.supplyOptions.length;
  }

  resetMessages(): void {
    this.clientDisabled = false;
    this.petDisabled = false;
    this.petIdInvalid = false;
    this.clientDataMessage = '';
  }

  attachSupplySubscriber(control: FormGroup): void {
    const sub = control.get('supplyTypeId')!.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe(supplyTypeId => {
        const units = this.supplyOptions.find(opt => opt.value === supplyTypeId)?.units || 0;
        const qty = control.get('quantity');
        const validators: any[] = [Validators.required, Validators.min(1)];
        if (units > 0) validators.push(Validators.max(units));
        qty?.setValidators(validators);
        qty?.updateValueAndValidity({ emitEvent: false });
        if (qty?.value && units > 0 && qty.value > units) {
          qty.setValue(units, { emitEvent: false });
        }
      });

    this.supplySubscriptions.push(sub);
  }

  getSupplyUnits(index: number): number | null {
    const id = this.supplies.at(index).get('supplyTypeId')?.value;
    const opt = this.supplyOptions.find(o => o.value === id);
    return opt ? (opt.units || 0) : null;
  }

  onQuantityInput(index: number, event: any): void {
    const max = this.getSupplyUnits(index);
    const ctrl = this.supplies.at(index).get('quantity');
    const val = Number(event.target.value);
    if (max !== null && max !== 0 && val > max) {
      ctrl?.setValue(max);
    }
  }

  onSavePress(): void {

    if (this.form?.valid) {

      this.confirmationService.confirm({

        header: 'Confirmar acción',
        icon: 'pi pi-question-circle',
        acceptLabel: 'Confirmar',
        rejectLabel: 'Cancelar',

        acceptButtonStyleClass: 'btn',
        rejectButtonStyleClass: 'cancel',

        message: `
          ¿Desea confirmar esta operación?
        `,
        accept: () => {

          this.showContinueDialog = false;

          let payload = this.form.value;

          payload.total = this.total;
          payload.dueDate = this.payInInstallments ? this.dueDate : null;
          
          this.save.emit(payload);
        }
      });

    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ingrese un valor para la atención.' });
      return;
    }
    
  }

  continue(): void {
    if (this.form.valid) {
      this.showContinueDialog = true;
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Por favor, complete todos los campos' });
      return;
    }

    this.loadSupplySummary();

    this.calculateTotals();
  }

  onCancel(): void {
    this.cancel.emit();
  }

  closeContinueDialog(): void {

    const visitControl = this.form.get('visitValue');

    visitControl?.setValue(0);

    this.showContinueDialog = false;
  }

  loadSupplySummary(): void {
    this.suppliesSummary = [];
    this.totalSuppliesCost = 0;

    this.supplies.controls.forEach(ctrl => {
      const supplyTypeId = ctrl.get('supplyTypeId')?.value;
      const quantity = Number(ctrl.get('quantity')?.value || 0);

      if (!supplyTypeId || quantity <= 0) return;

      const option = this.supplyOptions.find(opt => opt.value === supplyTypeId);
      if (!option) return;

      const item = {
        name: option.name,
        quantity: quantity,
        cost: option.price * this.profitMarginMult
      };

      this.suppliesSummary.push(item);
      this.totalSuppliesCost += (item.quantity * item.cost);
    });
  }

  onVisitValueChange(): void {
    this.calculateTotals();
  }

  private calculateTotals(): void {
    const visitValue = Number(this.form.get('visitValue')?.value || 0);

    this.totalVisitCost = visitValue;
    this.total = this.totalVisitCost + this.totalSuppliesCost;

    if (this.payInInstallments) {
      this.installmentValue = this.total / 3;

      const today = new Date();

      const first = new Date(today);
      first.setMonth(first.getMonth() + 1);

      const due = new Date(today);
      due.setMonth(due.getMonth() + 1);
      due.setDate(due.getDate() + 10);

      this.firstPayDate = first.toISOString().split('T')[0];
      this.dueDate = due.toISOString().split('T')[0];
    } else {
      this.installmentValue = 0;
    }
  }
  
  onPaymentModeChange() {
    this.payInInstallments = this.form.get('payInInstallments')?.value;
    this.calculateTotals();
  }


}
