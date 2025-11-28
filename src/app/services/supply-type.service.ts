import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { SupplyType } from '../../types';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class SupplyTypeService {

  private URL = `${environment.URL}/supply-type`;

  constructor(
    private apiService: ApiService
  ) { }

  findAll(): Observable<SupplyType[]> {
    return this.apiService.get<SupplyType[]>(this.URL, {});
  }

  findOne(id: number): Observable<SupplyType> {
    return this.apiService.get<SupplyType>(`${this.URL}/${id}`, {});
  }

  post(supplyType: SupplyType): Observable<SupplyType> {
    return this.apiService.post<SupplyType, SupplyType>(this.URL, supplyType, {});
  }

  patch(id: number, supplyType: SupplyType): Observable<SupplyType> {
    return this.apiService.patch<SupplyType, SupplyType>(`${this.URL}/${id}`, supplyType, {});
  }

  delete(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.URL}/${id}`, {});
  }
}
