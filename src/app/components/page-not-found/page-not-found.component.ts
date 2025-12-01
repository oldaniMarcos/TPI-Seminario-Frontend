import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.scss'
})
export class PageNotFoundComponent {

  constructor(private router: Router, private authService: AuthService) {}

  return() {

    const token = this.authService.getToken()

    if (!token) {
      this.router.navigate(['/login']) 
    } else {
      this.router.navigate(['/home'])
    }
    
  }
}
