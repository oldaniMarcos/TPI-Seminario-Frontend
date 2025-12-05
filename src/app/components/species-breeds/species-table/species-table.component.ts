import { Component, Input } from '@angular/core';
import { Species } from '../../../../types';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-species-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './species-table.component.html',
  styleUrl: './species-table.component.scss'
})
export class SpeciesTableComponent {

  constructor(
    private router: Router,
  ) {}

  @Input() species: Species[] = [];

  goToBreeds(speciesId: number) {
    this.router.navigate(['/species', speciesId, 'breeds']);
  }

}
