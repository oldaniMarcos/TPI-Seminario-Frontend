import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { Veterinary } from '../../../../types';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-vets-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, DialogModule, DropdownModule, FloatLabelModule],
  templateUrl: './vets-dialog.component.html',
  styleUrl: './vets-dialog.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class VetsDialogComponent {
  @Input() data: any = null;
  @Output() save = new EventEmitter<Veterinary>();
  @Output() cancel = new EventEmitter<void>();
  form!: FormGroup;

  docTypes = ['DNI', 'CI', 'LE', 'LC'];

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      licenseNumber: [this.data?.licenseNumber || '', Validators.required],
      docNum:        [this.data?.docNum || '', Validators.required],
      docType:       [this.data?.docType || '', Validators.required],
      fullName:      [this.data?.fullName || '', Validators.required],
      phone:         [this.data?.phone || '', Validators.required],
      address:       [this.data?.address || '', Validators.required],
      email:         [this.data?.email || '', [Validators.required, Validators.email]],
      state:         ['alta']
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
