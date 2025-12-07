import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Installment } from '../../types';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class InstallmentService {

  private URL = `${environment.URL}/installment`;

  constructor(
    private apiService: ApiService
  ) { }

  findAll(): Observable<Installment[]> {
    return this.apiService.get<Installment[]>(this.URL, {});
  }

  findOne(id: number): Observable<Installment> {
    return this.apiService.get<Installment>(`${this.URL}/${id}`, {});
  }

  post(installment: Installment): Observable<Installment> {
    return this.apiService.post<Installment, Installment>(this.URL, installment, {});
  }

  patch(id: number, installment: Installment): Observable<Installment> {
    return this.apiService.patch<Installment, Installment>(`${this.URL}/${id}`, installment, {});
  }

  delete(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.URL}/${id}`, {});
  }

  payInstallment(id: number) {
    return this.apiService.patch<Installment, Partial<Installment>>(`${this.URL}/${id}/pay`, {}, {});
  }

}
