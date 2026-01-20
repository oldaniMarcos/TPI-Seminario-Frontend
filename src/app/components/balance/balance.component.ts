import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ChartModule, UIChart } from 'primeng/chart';

import { CashFlowService } from '../../services/cash-flow.service';

@Component({
  selector: 'app-balance',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, InputTextModule, FloatLabelModule, ChartModule],
  templateUrl: './balance.component.html',
  styleUrl: './balance.component.scss'
})
export class BalanceComponent {

  @ViewChild('chart') chart!: UIChart;

  today = new Date().toISOString().split('T')[0];
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

    const fromDate = this.form.get('fromDate')?.value;
    const toDate = this.form.get('toDate')?.value;

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

  private getTotals(data: any[]) {
    this.totalInflows = data.reduce((sum, record) => sum + (record.inflows ?? 0), 0);
    this.totalOutflows = data.reduce((sum, record) => sum + (record.outflows ?? 0), 0);
    this.netBalance = this.totalInflows - this.totalOutflows;
  }

  private buildChart(data: any[]): void {

    const labels = data.map(d => d.closeDate);

    const inflowData = data.map(d => d.inflows ?? 0);
    const outflowData = data.map(d => d.outflows ?? 0);

    this.chartData = {
      labels,
      datasets: [
        {
          label: 'Ingresos',
          data: inflowData,
          backgroundColor: '#4caf4fd0',
          borderColor: '#43a047',
          borderWidth: 1
        },
        {
          label: 'Egresos',
          data: outflowData,
          backgroundColor: '#ff6666d5',
          borderColor: '#ff3f3f',
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

    const inputDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return inputDate > today ? { futureDate: true } : null;
  }
}
