import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Withdrawal } from '../../types';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class WithdrawalService {

  private URL = `${environment.URL}/withdrawal`;

  constructor(
    private apiService: ApiService
  ) { }

  findAll(): Observable<Withdrawal[]> {
    return this.apiService.get<Withdrawal[]>(this.URL, {});
  }

  findAllPending(): Observable<Withdrawal[]> {
    return this.apiService.get<Withdrawal[]>(`${this.URL}/pending`, {});
  }

  findOne(id: number): Observable<Withdrawal> {
    return this.apiService.get<Withdrawal>(`${this.URL}/${id}`, {});
  }

  post(withdrawal: Withdrawal): Observable<Withdrawal> {
    return this.apiService.post<Withdrawal, Withdrawal>(this.URL, withdrawal, {});
  }

  patch(id: number, withdrawal: Withdrawal): Observable<Withdrawal> {
    return this.apiService.patch<Withdrawal, Withdrawal>(`${this.URL}/${id}`, withdrawal, {});
  }

  delete(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.URL}/${id}`, {});
  }
}
