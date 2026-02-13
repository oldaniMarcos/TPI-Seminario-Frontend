import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { SupplyPrice } from '../../../../types';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-prices-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, DialogModule, DropdownModule, FloatLabelModule],
  templateUrl: './prices-dialog.component.html',
  styleUrl: './prices-dialog.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class PricesDialogComponent {

  @Input() data: any = null;
  @Input() supplyTypeId: number = 0;
  @Output() save = new EventEmitter<SupplyPrice>();
  @Output() cancel = new EventEmitter<void>();
  form!: FormGroup;

  currencies = ['ARS', 'USD'];

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      beginDate:    [this.data?.beginDate || '', Validators.required],
      currency:     [this.data?.currency || '', Validators.required],
      price:        [this.data?.price || '', [Validators.required, Validators.min(0)]],
      supplyTypeId: [this.supplyTypeId, Validators.required],
    });
  }

  ngOnChanges(): void {
    if (this.form && this.data) {
      this.form.patchValue(this.data);
    }

    if (this.form && !this.data) {
      this.form.reset({ state: 'alta' });
    }
  }

  submit() {
    if (this.form.invalid) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Por favor, complete todos los campos' });
      return;
    }

    this.save.emit(this.form.value);
    this.form.reset();
  }

  onCancel() {
    this.form.reset();
    this.cancel.emit();
  }

}
