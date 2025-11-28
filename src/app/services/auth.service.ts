import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { User } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private URL = `${environment.URL}/auth`
  private token: string | null = null

  constructor( private apiService: ApiService, private localStorage: LocalStorageService) { }

  login(username: string, password: string) {
    return this.apiService.post<any, any>(`${this.URL}/login`, { username, password }, {}).pipe(
      tap(res => {
        this.token = res.token
        this.localStorage.setItem('token', this.token!)
      })
    )
  }

  getToken(): string | null {
    return this.token || this.localStorage.getItem('token')
  }

  logout() {
    this.token = null;
    this.localStorage.clear()
  }

  fetchDetails() {
    return this.apiService.get<User>(`${this.URL}/me`, {
      headers: { Authorization: `Bearer ${this.getToken()}` }
    });
  }

}
