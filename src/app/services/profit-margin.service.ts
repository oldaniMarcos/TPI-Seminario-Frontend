import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ProfitMargin } from '../../types';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ProfitMarginService {

  private URL = `${environment.URL}/profit-margin`;

  constructor(
    private apiService: ApiService
  ) { }

  findAll(): Observable<ProfitMargin[]> {
    return this.apiService.get<ProfitMargin[]>(this.URL, {});
  }

  findOne(id: number): Observable<ProfitMargin> {
    return this.apiService.get<ProfitMargin>(`${this.URL}/${id}`, {});
  }

  post(profitMargin: ProfitMargin): Observable<ProfitMargin> {
    return this.apiService.post<ProfitMargin, ProfitMargin>(this.URL, profitMargin, {});
  }

  patch(id: number, profitMargin: ProfitMargin): Observable<ProfitMargin> {
    return this.apiService.patch<ProfitMargin, ProfitMargin>(`${this.URL}/${id}`, profitMargin, {});
  }

  delete(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.URL}/${id}`, {});
  }
}
