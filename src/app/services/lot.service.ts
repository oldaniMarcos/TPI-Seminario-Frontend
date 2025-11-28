import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Lot } from '../../types';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class LotService {

  private URL = `${environment.URL}/lot`;

  constructor(
    private apiService: ApiService
  ) { }

  findAll(): Observable<Lot[]> {
    return this.apiService.get<Lot[]>(this.URL, {});
  }

  findOne(id: number): Observable<Lot> {
    return this.apiService.get<Lot>(`${this.URL}/${id}`, {});
  }

  post(lot: Lot): Observable<Lot> {
    return this.apiService.post<Lot, Lot>(this.URL, lot, {});
  }

  patch(id: number, lot: Lot): Observable<Lot> {
    return this.apiService.patch<Lot, Lot>(`${this.URL}/${id}`, lot, {});
  }

  delete(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.URL}/${id}`, {});
  }
}
