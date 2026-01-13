import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SupplyType } from '../../../../types';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-supply-types-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, DialogModule, DropdownModule, FloatLabelModule, DividerModule, CommonModule],
  templateUrl: './supply-types-dialog.component.html',
  styleUrl: './supply-types-dialog.component.scss'
})
export class SupplyTypesDialogComponent {
  @Input() data: any = null;
  @Input() supplyTypeId: number = 0;
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();
  form!: FormGroup;

  currencies = ['ARS', 'USD'];
  visible: boolean = true;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    
    this.form = this.fb.group({
      description:  [this.data?.description || '', Validators.required],

      lotNumber:    [this.data?.lotNumber || '', Validators.required],
      dueDate:      [this.data?.dueDate || '', Validators.required],
      units:        [this.data?.units || '', [Validators.required, Validators.min(1)]],

      beginDate:    [{ value: this.today(), disabled: true}, Validators.required],
      currency:     [this.data?.currency || '', Validators.required],
      price:        [this.data?.price || '', [Validators.required, Validators.min(0)]],
      
      supplyTypeId: [this.supplyTypeId, Validators.required],
    });
  }

  ngOnChanges(): void {
    if (!this.form) return;

    if (this.data) {
      this.isEditMode = true;
      this.loadEditMode();
    } else {
      this.isEditMode = false;
      this.loadCreateMode();
    }
  }

  private loadEditMode(): void {
    this.form.reset({
      description: this.data.description
    });

    this.disableCreationControls();
    this.visible = false;
  }

  private loadCreateMode(): void {
    this.form.reset({
      description: '',
      lotNumber: '',
      dueDate: '',
      units: '',
      beginDate: this.today(),
      currency: '',
      price: '',
      supplyTypeId: this.supplyTypeId
    });

    this.enableCreationControls();
    this.form.get('beginDate')?.disable();
    this.visible = true;
  }

  submit() {
    if (this.form.invalid) return;

    this.save.emit(this.form.getRawValue());

    if (!this.isEditMode) {
      this.loadCreateMode();
    }
  }

  onCancel() {
    this.cancel.emit();

    if (!this.isEditMode) {
      this.loadCreateMode();
    }
  }

  private disableCreationControls() {
    [
      'lotNumber',
      'dueDate',
      'units',
      'beginDate',
      'currency',
      'price',
      'supplyTypeId'
    ].forEach(control => {
      this.form.get(control)?.disable();
    });
  }

  private enableCreationControls() {
    [
      'lotNumber',
      'dueDate',
      'units',
      'beginDate',
      'currency',
      'price',
      'supplyTypeId'
    ].forEach(control => {
      this.form.get(control)?.enable();
    });
  }

  private today(): string {
    return new Date().toISOString().split('T')[0];
  }

  private resetForm(): void {
    const today = new Date().toISOString().split('T')[0];

    this.form.reset({
      description: '',
      lotNumber: '',
      dueDate: '',
      units: '',
      beginDate: today,
      currency: '',
      price: '',
      supplyTypeId: this.supplyTypeId
    });

    this.form.get('beginDate')?.disable();
  }
}
