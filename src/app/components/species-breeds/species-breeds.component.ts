import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SpeciesTableComponent } from './species-table/species-table.component';
import { SpeciesService } from '../../services/species.service';
import { Species } from '../../../types';

@Component({
  selector: 'app-species-breeds',
  standalone: true,
  imports: [CommonModule, RouterLink, SpeciesTableComponent],
  templateUrl: './species-breeds.component.html',
  styleUrl: './species-breeds.component.scss'
})
export class SpeciesBreedsComponent {
  species: Species[] = []

  constructor(
    private speciesService: SpeciesService,
  ) { }

  ngOnInit() {
    this.findSpecies()
  }

  findSpecies(): void {
    this.speciesService.findAll().subscribe(
      (data: Species[]) => {
        this.species = data
      },
    );
  }

  displayCreatePopup: boolean = false
  displayUpdatePopup: boolean = false
  displaySelectPopup: boolean = false

  //toggle popups

  // toggleCreatePopup() {
  //   this.displayCreatePopup = true
  // }

  // toggleUpdatePopup(client: Client) {
  //   this.selected = client
  //   this.displayUpdatePopup = true
  // }

  // toggleSelectPopup(client: Client) {
  //   this.selected = client
  //   this.displaySelectPopup = true
  // }

  // toggleDeletePopup(client: Client) {
  //   if (!client.id) return

  //   this.deleteClient(client.id)
  // }
}
