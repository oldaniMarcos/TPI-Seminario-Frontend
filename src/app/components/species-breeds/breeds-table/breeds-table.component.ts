import { Component, Input } from '@angular/core';
import { Breed } from '../../../../types';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-breeds-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './breeds-table.component.html',
  styleUrl: './breeds-table.component.scss'
})
export class BreedsTableComponent {
  
  @Input() breeds: Breed[] = [];

}
