import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CashFlowService } from '../../services/cash-flow.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, DialogModule, InputTextModule, ButtonModule, MessageModule, FormsModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  cashRegisterOpen: boolean = false;
  
  constructor(
      private router: Router
    , private authService: AuthService
    , private cashFlowService: CashFlowService,
  ) {}

  ngOnInit() {
    this.checkCashRegisterState();
  }

  checkCashRegisterState(): void {
    this.cashFlowService.findLatest().subscribe(
      (data) => {
        
        this.cashRegisterOpen = data.closeType === '' && data.closeDate === null;
        
      }
    );
  }

  logout() {
    this.authService.logout()
    this.router.navigate(['/login']);
  }

  tokenDialogVisible = false;
  tokenInput = '';
  tokenError = false;

  openTokenDialog() {
    this.tokenDialogVisible = true;
    this.tokenInput = '';
    this.tokenError = false;
  }

  closeTokenDialog() {
    this.tokenDialogVisible = false;
  }

  validateToken() {
    const validToken = '1234';

    if (this.tokenInput === validToken) {
      this.tokenDialogVisible = false;
      this.router.navigate(['/reports']);
    } else {
      this.tokenError = true;
    }
  }
}
