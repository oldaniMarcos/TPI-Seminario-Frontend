import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../../types';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../services/local-storage.service';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginData = { username: '', password: ''}
  errorMessage: string = ''
  users: User[] = []
  role = ''

  constructor(
    private userService: UserService
    , private router: Router
    , private localStorage: LocalStorageService
    , private authService: AuthService
  ) { }

  onSubmit() {
    this.authService.login(this.loginData.username, this.loginData.password).subscribe(
      (res) => {
        this.localStorage.setItem('token', res.token)
        this.router.navigate(['/home'])
      },
      () => {
        this.errorMessage = 'Credenciales Incorrectas'
      }
    )    
  }

  ngOnInit(): void {

    const token = this.localStorage.getItem('token')

    if (token) {
      this.router.navigate(['/home'])
    }
  }
}

