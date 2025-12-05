import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Pet } from '../../types';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class PetService {

  private URL = `${environment.URL}/pet`;

  constructor(
    private apiService: ApiService
  ) { }

  findAll(): Observable<Pet[]> {
    return this.apiService.get<Pet[]>(this.URL, {});
  }

  findOne(id: number): Observable<Pet> {
    return this.apiService.get<Pet>(`${this.URL}/${id}`, {});
  }

  post(pet: Pet): Observable<Pet> {
    return this.apiService.post<Pet, Pet>(this.URL, pet, {});
  }

  patch(id: number, pet: Pet): Observable<Pet> {
    return this.apiService.patch<Pet, Pet>(`${this.URL}/${id}`, pet, {});
  }

  delete(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.URL}/${id}`, {});
  }

  findByClientId(id: number): Observable<Pet[]> {
    return this.apiService.get<Pet[]>(`${this.URL}/client/${id}`, {})
  }

  updateState(id: number, state: 'alta' | 'baja'): Observable<any> {
    return this.apiService.patch<{state: 'alta' | 'baja'}, any>(`${this.URL}/${id}/state`, { state }, {})
  }
}
