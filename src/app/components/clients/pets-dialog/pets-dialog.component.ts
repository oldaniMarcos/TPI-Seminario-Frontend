import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { Breed, Pet, Species } from '../../../../types';
import { SpeciesService } from '../../../services/species.service';
import { BreedService } from '../../../services/breed.service';
import { state } from '@angular/animations';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-pets-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, DialogModule, DropdownModule, FloatLabelModule],
  templateUrl: './pets-dialog.component.html',
  styleUrl: './pets-dialog.component.scss'
})
export class PetsDialogComponent {

  @Input() data: any = null;
  @Input() clientId: number | null = null;
  @Output() save = new EventEmitter<Pet>();
  @Output() cancel = new EventEmitter<void>();
  form!: FormGroup;

  species: any = [];
  breeds: any = [];

  constructor(
    private fb: FormBuilder,
    private speciesService: SpeciesService,
    private breedService: BreedService,
    private messageService: MessageService,
  ) {}

  findAllSpecies(): void {
    this.speciesService.findAll().subscribe((data: Species[]) => {
      this.species = data
        .sort((a, b) => a.description.localeCompare(b.description))
        .map(s => ({ description: s.description, id: s.id }));    
        
      if (this.data) {
        this.patchEditValues();
      }
    });

  }

  ngOnInit(): void {

    this.form = this.fb.group({
      name:          [this.data?.name || '', Validators.required],
      birthDate:     [this.data?.birthDate || '', [Validators.required, this.notInFuture]],
      species:       [null, Validators.required],
      breed:         [{ value: '', disabled: true }, Validators.required],

      state:         ['alta']
    });

    this.findAllSpecies();
    this.onSpeciesChange();
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
    this.form.reset({ state: 'alta' });
  }

  onCancel() {
    this.form.reset({ state: 'alta' });
    this.cancel.emit();
  }

  onSpeciesChange(): void {
    this.form.get('species')!.valueChanges.subscribe((speciesId: number | null) => {
      if (!speciesId) {
        this.breeds = [];
        this.form.get('breed')!.disable();
        this.form.get('breed')!.reset();
        return;
      }

      this.loadBreedsBySpecies(speciesId);
    });
  }

  loadBreedsBySpecies(speciesId: number): void {
    this.breedService.findSpecies(speciesId).subscribe((breeds: Breed[]) => {
      this.breeds = breeds.sort((a, b) =>
        a.description.localeCompare(b.description)
      );

      this.form.get('breed')!.enable();
    });
  }

  private patchEditValues(): void {
    const species = this.species.find(
      (s: any) => s.description === this.data.speciesName
    );

    if (!species) return;

    this.form.patchValue({
      name: this.data.name,
      birthDate: this.data.birthDate,
      species: species.id,
      state: this.data.state
    });

    this.breedService.findSpecies(species.id).subscribe((breeds: Breed[]) => {
      this.breeds = breeds.sort((a, b) =>
        a.description.localeCompare(b.description)
      );

      const breed = this.breeds.find(
        (b: any) => b.description === this.data.breedName
      );

      if (breed) {
        this.form.get('breed')!.enable();
        this.form.patchValue({ breed: breed.id });
      }
    });
  }

  notInFuture(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    const inputDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return inputDate > today ? { futureDate: true } : null;
  }

  today = new Date().toISOString().split('T')[0];

}
