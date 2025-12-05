import { Component } from '@angular/core';
import { Breed } from '../../../../types';
import { BreedService } from '../../../services/breed.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BreedsTableComponent } from '../breeds-table/breeds-table.component';

@Component({
  selector: 'app-breeds',
  standalone: true,
  imports: [BreedsTableComponent, RouterLink],
  templateUrl: './breeds.component.html',
  styleUrl: './breeds.component.scss'
})
export class BreedsComponent {

  breeds: Breed[] = []
  speciesId = 0

  constructor(
    private breedService: BreedService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.speciesId = Number(this.route.snapshot.paramMap.get('id'));
    this.findBreedsBySpeciesId()
  }

  findBreedsBySpeciesId(): void {
    this.breedService.findSpecies(this.speciesId).subscribe(
      (data: Breed[]) => {
        this.breeds = data
      },
    );
  }
}
