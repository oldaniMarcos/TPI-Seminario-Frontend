import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { SupplyPrice } from '../../types';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class SupplyPriceService {

  private URL = `${environment.URL}/supply-price`;

  constructor(
    private apiService: ApiService
  ) { }

  findAll(): Observable<SupplyPrice[]> {
    return this.apiService.get<SupplyPrice[]>(this.URL, {});
  }

  findOne(id: number): Observable<SupplyPrice> {
    return this.apiService.get<SupplyPrice>(`${this.URL}/${id}`, {});
  }

  post(supplyPrice: SupplyPrice): Observable<SupplyPrice> {
    return this.apiService.post<SupplyPrice, SupplyPrice>(this.URL, supplyPrice, {});
  }

  patch(id: number, supplyPrice: SupplyPrice): Observable<SupplyPrice> {
    return this.apiService.patch<SupplyPrice, SupplyPrice>(`${this.URL}/${id}`, supplyPrice, {});
  }

  delete(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.URL}/${id}`, {});
  }

  findTypes(id: number): Observable<SupplyPrice[]> {
    return this.apiService.get<SupplyPrice[]>(`${this.URL}/types/${id}`, {})
  }
}
