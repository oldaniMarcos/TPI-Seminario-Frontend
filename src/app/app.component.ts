import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
//import { HeaderComponent } from './layout/header/header.component';
import { CommonModule } from '@angular/common';
import { ToastModule } from "primeng/toast";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'TP-DSW-Frontend';
  isVisible = true;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe(() => {
      
      const currentRoute = this.router.url;
      this.isVisible = currentRoute !== '/login';
    });
  }
}
