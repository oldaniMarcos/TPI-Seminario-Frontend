import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { Breed } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class BreedService {

  private URL = `${environment.URL}/breed`;

  constructor(
    private apiService: ApiService
  ) { }

  findAll(): Observable<Breed[]> {
    return this.apiService.get<Breed[]>(this.URL, {});
  }

  findOne(id: number): Observable<Breed> {
    return this.apiService.get<Breed>(`${this.URL}/${id}`, {});
  }

  post(breed: Breed): Observable<Breed> {
    return this.apiService.post<Breed, Breed>(this.URL, breed, {});
  }

  patch(id: number, breed: Breed): Observable<Breed> {
    return this.apiService.patch<Breed, Breed>(`${this.URL}/${id}`, breed, {});
  }

  // findSpecies(id: number): Observable<Species> {
  //   return this.apiService.get<Species>(`${this.URL}/${id}/Species`, {});
  // }

  delete(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.URL}/${id}`, {});
  }

  // hasSpecies(codSpecies: number): Observable<boolean> {
  //     return this.apiService.get<{ exists: boolean }>(`${this.URL}/exists/Species/${codSpecies}`, {})
  //       .pipe(map(response => response.exists));
  //   }
}
