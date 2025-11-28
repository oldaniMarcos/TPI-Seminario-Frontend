import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Veterinary } from '../../types';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class VeterinaryService {

  private URL = `${environment.URL}/veterinary`;

  constructor(
    private apiService: ApiService
  ) { }

  findAll(): Observable<Veterinary[]> {
    return this.apiService.get<Veterinary[]>(this.URL, {});
  }

  findOne(id: number): Observable<Veterinary> {
    return this.apiService.get<Veterinary>(`${this.URL}/${id}`, {});
  }

  post(veterinary: Veterinary): Observable<Veterinary> {
    return this.apiService.post<Veterinary, Veterinary>(this.URL, veterinary, {});
  }

  patch(id: number, veterinary: Veterinary): Observable<Veterinary> {
    return this.apiService.patch<Veterinary, Veterinary>(`${this.URL}/${id}`, veterinary, {});
  }

  delete(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.URL}/${id}`, {});
  }
}
