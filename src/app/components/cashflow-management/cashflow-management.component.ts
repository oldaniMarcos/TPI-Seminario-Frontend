import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CashFlowService } from '../../services/cash-flow.service';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { CashFlow } from '../../../types';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cashflow-management',
  standalone: true,
  imports: [CommonModule, RouterLink, DialogModule, FormsModule, InputTextModule, ButtonModule, MessageModule],
  providers: [],
  templateUrl: './cashflow-management.component.html',
  styleUrl: './cashflow-management.component.scss'
})
export class CashflowManagementComponent {

  currentCashRegister: CashFlow | null = null;
  cashRegisterOpen: boolean = false;
  openRegisterDialog: boolean = false;
  closeRegisterDialog: boolean = false;
  changeShiftDialog: boolean = false;
  amountInput: number = 0;
  amountError: boolean = false;
  cashRegisterAmount: number = 0;

  constructor(
    private cashFlowService: CashFlowService,
    private router: Router,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.checkCashRegisterState();
  }

  checkCashRegisterState(): void {
    this.cashFlowService.findLatest().subscribe(
      (data) => {

        this.cashRegisterOpen = data.closeType === '' && data.closeDate === null;

        if (this.cashRegisterOpen) {
          this.currentCashRegister = data;
          this.cashRegisterAmount = data.initialAmount + data.inflows - data.outflows;
        }
        
      }
    );
  }

  openRegister() {
    this.openRegisterDialog = true;
    this.amountInput = '' as any;
    this.amountError = false;
  }

  closeRegister() {
    this.closeRegisterDialog = true;
  }

  changeShift() {
    this.changeShiftDialog = true;
  }

  onCloseRegister() {
    this.cashFlowService.patch(this.currentCashRegister!.id!, {
        closeDate: new Date().toISOString().split('T')[0],
        closeType: 'z',
        initialAmount: this.currentCashRegister!.initialAmount,
        inflows: this.currentCashRegister!.inflows,
        outflows: this.currentCashRegister!.outflows,
    })
    .subscribe(
      () => {
        this.cashRegisterOpen = false;
        this.currentCashRegister = null;
        this.cashRegisterAmount = 0;
        this.closeDialogs();
      }
    );
  }

  onChangeShift() {
    this.cashFlowService.patch(this.currentCashRegister!.id!, {
        closeDate: new Date().toISOString().split('T')[0],
        closeType: 'x',
        initialAmount: this.currentCashRegister!.initialAmount,
        inflows: this.currentCashRegister!.inflows,
        outflows: this.currentCashRegister!.outflows,
    })
    .subscribe(
      () => {
        this.cashRegisterOpen = false;
        this.currentCashRegister = null;
        this.cashRegisterAmount = 0;
        this.closeDialogs();

        this.authService.logout()
        this.router.navigate(['/login']);
      }
    );
  }

  closeDialogs() {
    this.openRegisterDialog = false;
    this.closeRegisterDialog = false;
    this.changeShiftDialog = false;
  }

  validateAmount() {
    this.amountError = this.amountInput <= 0;

    if (!this.amountError) {
      this.cashFlowService.post({
        closeDate: null,
        closeType: '',
        initialAmount: this.amountInput,
        inflows: 0,
        outflows: 0,
      })
      .subscribe(
        (data) => {
          this.cashRegisterOpen = true;
          this.closeDialogs();
      })
    }
  }
}
