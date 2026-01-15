import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { Client } from '../../../../types';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { PetsDialogComponent } from '../pets-dialog/pets-dialog.component';
import { CommonModule } from '@angular/common';
import { AdoptPetComponent } from '../adopt-pet/adopt-pet.component';
import { AdoptPetDialogComponent } from "../adopt-pet-dialog/adopt-pet-dialog.component";

@Component({
  selector: 'app-clients-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FloatLabelModule, InputTextModule, DropdownModule, DialogModule, PetsDialogComponent, AdoptPetDialogComponent],
  templateUrl: './clients-dialog.component.html',
  styleUrl: './clients-dialog.component.scss'
})
export class ClientsDialogComponent {
  @Input() data: any = null;
  @Input() clientId: number | null = null;
  @Input() editMode: boolean = false;
  @Output() save = new EventEmitter<Client>();
  @Output() cancel = new EventEmitter<void>();
  form!: FormGroup;

  today = new Date().toISOString().split('T')[0];
  docTypes = ['DNI', 'CI', 'LE', 'LC'];
  showDialog: boolean = false;
  showRegisterDialog: boolean = false;
  showAdoptDialog: boolean = false;
  dialogTitle: string = '';
  registerAdoptTitle: string = '';
  isAdopting: boolean = false;
  isRegistering: boolean = false;

  constructor(
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {

    this.form = this.fb.group({
      fullName:          [this.data?.fullName || '', Validators.required],
      docNum:        [this.data?.docNum || '', Validators.required],
      docType:       [this.data?.docType || '', Validators.required],
      phone:         [this.data?.phone || '', Validators.required],
      address:       [this.data?.address || '', Validators.required],

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
    if (this.form.invalid) return;

    if (this.editMode) {
      this.save.emit(this.form.value);
      this.form.reset();
    }
    else {
      this.showDialog = true;
      this.dialogTitle = "¿Desea registrar una nueva mascota o adoptar una existente?";
    }
    
  }

  onCancel() {
    this.form.reset();
    this.cancel.emit();
  }

  onDialogCancel() {
    this.showDialog = false;
  }

  onAdoptCancel() {
    this.showAdoptDialog = false;
  }

  onRegisterCancel() {
    this.showRegisterDialog = false;
  }

  onAdopt() {
    this.showDialog = false;
    this.registerAdoptTitle = "Registrar Adopción";
    this.showAdoptDialog = true;
    this.showRegisterDialog = false;
  }

  onRegister() {
    this.showDialog = false;
    this.registerAdoptTitle = "Registrar Mascota";
    this.showAdoptDialog = false;
    this.showRegisterDialog = true;
  }

  notInFuture(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    const inputDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return inputDate > today ? { futureDate: true } : null;
  }
}
