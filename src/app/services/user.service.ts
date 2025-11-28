import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // find user with username and password

  private URL = `${environment.URL}/user`;

  constructor(
    private apiService: ApiService
  ) { }

}
