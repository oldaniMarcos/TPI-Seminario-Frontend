import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Client } from '../../types';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private URL = `${environment.URL}/client`;

  constructor(
    private apiService: ApiService
  ) { }

  findAll(): Observable<Client[]> {
    return this.apiService.get<Client[]>(this.URL, {});
  }

  findOne(id: number): Observable<Client> {
    return this.apiService.get<Client>(`${this.URL}/${id}`, {});
  }

  post(client: Client): Observable<Client> {
    return this.apiService.post<Client, Client>(this.URL, client, {});
  }

  patch(id: number, client: Client): Observable<Client> {
    return this.apiService.patch<Client, Client>(`${this.URL}/${id}`, client, {});
  }

  delete(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.URL}/${id}`, {});
  }

  updateState(id: number, state: 'alta' | 'baja'): Observable<any> {
    return this.apiService.patch<{state: 'alta' | 'baja'}, any>(`${this.URL}/${id}/state`, { state }, {})
  }
}
