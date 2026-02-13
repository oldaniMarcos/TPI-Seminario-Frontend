import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Lot } from '../../../../types';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-lots-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, DialogModule, FloatLabelModule],
  templateUrl: './lots-dialog.component.html',
  styleUrl: './lots-dialog.component.scss'
})
export class LotsDialogComponent {

  @Input() data: any = null;
  @Input() supplyTypeId: number = 0;
  @Output() save = new EventEmitter<Lot>();
  @Output() cancel = new EventEmitter<void>();
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      lotNumber:  [this.data?.lotNumber || '', Validators.required],
      units:       [this.data?.units || '', [Validators.required, Validators.min(1)]],
      dueDate:     [this.data?.dueDate || '', Validators.required],
      supplyTypeId: [this.supplyTypeId, Validators.required],
    });
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

  ngOnChanges(): void {
    if (this.form && this.data) {
      this.form.patchValue(this.data);
    }

    if (this.form && !this.data) {
      this.form.reset();
    }
  }
}
