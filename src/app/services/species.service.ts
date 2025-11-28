import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Species } from '../../types';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class SpeciesService {

  private URL = `${environment.URL}/species`;

  constructor(
    private apiService: ApiService
  ) { }

  findAll(): Observable<Species[]> {
    return this.apiService.get<Species[]>(this.URL, {});
  }

  findOne(id: number): Observable<Species> {
    return this.apiService.get<Species>(`${this.URL}/${id}`, {});
  }

  post(species: Species): Observable<Species> {
    return this.apiService.post<Species, Species>(this.URL, species, {});
  }

  patch(id: number, species: Species): Observable<Species> {
    return this.apiService.patch<Species, Species>(`${this.URL}/${id}`, species, {});
  }

  delete(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.URL}/${id}`, {});
  }
}
