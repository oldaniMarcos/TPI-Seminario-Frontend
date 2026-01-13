import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ApiService } from './api.service';
import { CashFlow } from '../../types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CashFlowService {

  private URL = `${environment.URL}/cash-flow`;

  constructor(
    private apiService: ApiService
  ) { }

  findAll(): Observable<CashFlow[]> {
    return this.apiService.get<CashFlow[]>(this.URL, {});
  }

  findOne(id: number): Observable<CashFlow> {
    return this.apiService.get<CashFlow>(`${this.URL}/${id}`, {});
  }

  post(cashFlow: CashFlow): Observable<CashFlow> {
    return this.apiService.post<CashFlow, CashFlow>(this.URL, cashFlow, {});
  }

  patch(id: number, cashFlow: CashFlow): Observable<CashFlow> {
    return this.apiService.patch<CashFlow, CashFlow>(`${this.URL}/${id}`, cashFlow, {});
  }

  delete(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.URL}/${id}`, {});
  }

  findLatest(): Observable<CashFlow> {
    return this.apiService.get<CashFlow>(`${this.URL}/latest`, {});
  }
}
