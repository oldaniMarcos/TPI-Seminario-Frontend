import { Component, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { CashFlowService } from '../../services/cash-flow.service';
import { ChartModule, UIChart } from 'primeng/chart';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-balance-monthly',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, InputTextModule, FloatLabelModule, ChartModule],
  templateUrl: './balance-monthly.component.html',
  styleUrl: './balance-monthly.component.scss'
})
export class BalanceMonthlyComponent {

  @ViewChild('chart') chart!: UIChart;
  
  currentMonth = new Date().toISOString().slice(0, 7);
  invalidDatesMessage: string = '';
  form!: FormGroup;
  showChart: boolean = false;

  chartData: any;
  chartOptions: any;

  totalInflows: number = 0;
  totalOutflows: number = 0;
  netBalance: number = 0;

  constructor(
    private cashFlowService: CashFlowService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {

    this.form = this.fb.group({
      fromDate:     ['', [Validators.required, this.notInFuture]],
      toDate:     ['', [Validators.required, this.notInFuture]],
    });
    
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      },
    };
  }

  getByDate(): void {

    if (this.form.invalid) {
      this.invalidDatesMessage = 'Rango de fechas inválido';
      this.showChart = false;
      return;
    }

    const fromDate = this.addDay(this.form.get('fromDate')?.value);
    const toDate = this.addDay(this.form.get('toDate')?.value);

    if (new Date(fromDate) > new Date(toDate)) {
      this.invalidDatesMessage = 'La fecha "Desde" no puede ser mayor que la fecha "Hasta"';
      this.showChart = false;
      return;
    }

    this.invalidDatesMessage = '';
    this.cashFlowService.findByDateRange(fromDate, toDate).subscribe({
      next: (data) => {

        if (data.length === 0) {
          this.invalidDatesMessage = 'No hay datos disponibles para el rango de fechas seleccionado';
          this.showChart = false;
          return;
        }

        this.getTotals(data);
        this.buildChart(data);

      }
    });

  }

  private addDay(date: string): string {
    const [year, month] = date.split('-').map(Number);

    const lastDay = new Date(year, month, 0).getDate();

    return `${date}-${lastDay.toString().padStart(2, '0')}`;
  }


  private getTotals(data: any[]) {
    this.totalInflows = data.reduce((sum, record) => sum + (record.inflows ?? 0), 0);
    this.totalOutflows = data.reduce((sum, record) => sum + (record.outflows ?? 0), 0);
    this.netBalance = this.totalInflows - this.totalOutflows;
  }

  private buildChart(data: any[]): void {

    const monthlyMap = new Map<string, number>();

    data.forEach(d => {
      const month = d.closeDate.slice(0, 7); // YYYY-MM

      const inflow = d.inflows ?? 0;
      const outflow = d.outflows ?? 0;
      const balance = inflow - outflow;

      monthlyMap.set(
        month,
        (monthlyMap.get(month) ?? 0) + balance
      );
    });

    const labels = Array.from(monthlyMap.keys()).sort();
    const balances = labels.map(m => monthlyMap.get(m)!);

    this.chartData = {
      labels,
      datasets: [
        {
          label: 'Balance mensual',
          data: balances,
          backgroundColor: balances.map(v => v >= 0 ? '#4caf4fd0' : '#ff6666d5'),
          borderColor: balances.map(v => v >= 0 ? '#43a047' : '#ff3f3f'),
          borderWidth: 1
        }
      ]
    };

    this.showChart = true;

    setTimeout(() => {
      this.chart.refresh();
    });
  }


  notInFuture(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    const [year, month] = control.value.split('-').map(Number);
    const inputDate = new Date(year, month - 1, 1);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    today.setDate(1);

    return inputDate > today ? { futureDate: true } : null;
  }

}
