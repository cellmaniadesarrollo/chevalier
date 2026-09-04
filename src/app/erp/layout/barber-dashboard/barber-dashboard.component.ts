import { Component } from '@angular/core';
import { SalesService } from '../../service/sales/sales.service';

@Component({
  selector: 'app-barber-dashboard',
  templateUrl: './barber-dashboard.component.html',
  styleUrl: './barber-dashboard.component.css'
})
export class BarberDashboardComponent {
  isDataLoaded = false;
  loading = false;

  filterMode: 'today' | 'range' = 'today';
  startDate: string = '';
  endDate: string = '';

  // Variables para restringir los inputs HTML
  minDate: string = '';
  maxDate: string = '';

  cuts: any[] = [];
  totals = { totalCuts: 0, totalGross: 0, totalDiscount: 0, totalNet: 0 };

  constructor(private salesService: SalesService) { }

  ngOnInit(): void {
    this.setupDateLimits();
    this.loadReport();
  }

  setupDateLimits(): void {
    const today = new Date();

    // Fecha máxima: Hoy
    this.maxDate = this.formatDateToYYYYMMDD(today);

    // Fecha mínima: Hace 1 mes exacto a partir de hoy
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(today.getMonth() - 1);
    this.minDate = this.formatDateToYYYYMMDD(oneMonthAgo);
  }

  // Helper para convertir objeto Date a formato 'YYYY-MM-DD' requerido por <input type="date">
  private formatDateToYYYYMMDD(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onFilterModeChange(): void {
    if (this.filterMode === 'today') {
      this.startDate = '';
      this.endDate = '';
      this.loadReport();
    }
  }

  applyRangeFilter(): void {
    if (!this.startDate || !this.endDate) return;

    // Validación de seguridad por código (evita fechas fuera del rango permitido)
    if (this.startDate < this.minDate || this.endDate > this.maxDate || this.startDate > this.endDate) {
      console.warn('El rango de fechas no es válido.');
      return;
    }

    this.loadReport();
  }

  async loadReport(): Promise<void> {
    this.loading = true;
    try {
      const data = this.filterMode === 'range'
        ? await this.salesService.getMyCutsReport(this.startDate, this.endDate)
        : await this.salesService.getMyCutsReport();

      this.cuts = data.cuts;
      this.totals = data.totals;
      this.isDataLoaded = true;
    } catch (error) {
      console.error('Error cargando mis cortes:', error);
    } finally {
      this.loading = false;
    }
  }

  getPaymentIcon(method: string): string {
    const m = method?.toUpperCase();
    if (m === 'EFECTIVO') return 'bi-cash';
    if (m === 'TRANSFERENCIA') return 'bi-phone';
    return 'bi-credit-card';
  }
}
