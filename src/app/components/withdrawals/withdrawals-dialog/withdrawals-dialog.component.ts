import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { Withdrawal } from '../../../../types';

@Component({
  selector: 'app-withdrawals-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, FloatLabelModule, InputTextModule],
  templateUrl: './withdrawals-dialog.component.html',
  styleUrl: './withdrawals-dialog.component.scss'
})
export class WithdrawalsDialogComponent {

  @Input() data: any = null;
  @Output() save = new EventEmitter<Withdrawal>();
  @Output() cancel = new EventEmitter<void>();
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    
    this.form = this.fb.group({
      description: [this.data?.description || '', Validators.required],
      amount:       [this.data?.amount || '', [Validators.required, Validators.min(0)]],

      dateTime:    [new Date().toISOString(), Validators.required],
      state:       ['Pendiente', Validators.required],
      payDate:     [null],
    });
  }

  submit() {
    if (this.form.invalid) return;

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
