import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Visit } from '../../types';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class VisitService {

  private URL = `${environment.URL}/visit`;

  constructor(
    private apiService: ApiService
  ) { }

  findAll(): Observable<Visit[]> {
    return this.apiService.get<Visit[]>(this.URL, {});
  }

  findOne(id: number): Observable<Visit> {
    return this.apiService.get<Visit>(`${this.URL}/${id}`, {});
  }

  post(visit: Visit): Observable<Visit> {
    return this.apiService.post<Visit, Visit>(this.URL, visit, {});
  }

  patch(id: number, visit: Visit): Observable<Visit> {
    return this.apiService.patch<Visit, Visit>(`${this.URL}/${id}`, visit, {});
  }

  delete(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.URL}/${id}`, {});
  }

  registerVisit(visit: any): Observable<any> {
    return this.apiService.post<any, any>(`${this.URL}/register`, visit, {});
  }
}
