import { Component } from '@angular/core';
import { MovementDetailModalComponent } from '../movement-detail-modal/movement-detail-modal.component';
import { SalesService } from '../../service/sales/sales.service';
import { MatDialog } from '@angular/material/dialog';

interface Cut {
  saleId: string;
  saleNumber: number;
  saleDate: string;
  client: string;
  service: string;
  quantity: number;
  grossPrice: number;
  netPrice: number;
  discountAmount: number;
  discountInfo: {
    name: string;
    type: string;
    value: number;
  } | null;
  collaborators: { name: string; value: number }[];
  paymentMethod: string;
}

interface BarberReport {
  barberId: string;
  barberName: string;
  totalGross: number;
  totalDiscount: number;
  totalNet: number;
  cuts: Cut[];
}

interface CashSummary {
  totalCash: number;
  totalTransfer: number;
  totalOther: number;
  grandTotal: number;
}

interface Movement {
  _id: string;
  description: string;
  type: 'income' | 'expense';
  amount: number;
  createdAt: string;
  createdBy?: { username: string };
}

interface DiscountApplied {
  saleId: string;
  saleNumber: number;
  saleDate: string;
  barberName: string;
  client: string;
  service: string;
  grossPrice: number;
  discountAmount: number;
  netPrice: number;
  discountInfo: { name: string; type: string; value: number } | null;
}

@Component({
  selector: 'app-cashier-dashboard',
  templateUrl: './cashier-dashboard.component.html',
  styleUrl: './cashier-dashboard.component.css'
})
export class CashierDashboardComponent {
  isDataLoaded = false;

  barbers: BarberReport[] = [];
  expandedBarbers: Set<string> = new Set();

  cashSummary: CashSummary = { totalCash: 0, totalTransfer: 0, totalOther: 0, grandTotal: 0 };
  discountsApplied: DiscountApplied[] = []; // 🔹 nuevo
  movements: Movement[] = [];
  totalIncome = 0;
  totalExpense = 0;
  netMovements = 0;

  constructor(
    private salesService: SalesService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadReport();
  }

  async loadReport(): Promise<void> {
    try {
      const data = await this.salesService.getCashierDailyReport();
      this.barbers = data.barbers;
      this.cashSummary = data.cashSummary;
      this.discountsApplied = data.discountsApplied || [];
      this.movements = data.movements;
      this.totalIncome = data.totalIncome;
      this.totalExpense = data.totalExpense;
      this.netMovements = data.netMovements;
      this.isDataLoaded = true;
    } catch (error) {
      console.error('Error cargando reporte de caja:', error);
    }
  }

  toggleBarber(id: string): void {
    this.expandedBarbers.has(id)
      ? this.expandedBarbers.delete(id)
      : this.expandedBarbers.add(id);
  }

  isExpanded(id: string): boolean {
    return this.expandedBarbers.has(id);
  }

  viewMovementDetail(id: string): void {
    this.dialog.open(MovementDetailModalComponent, {
      width: '600px',
      data: { movementId: id }
    });
  }

  getPaymentIcon(method: string): string {
    const m = method?.toUpperCase();
    if (m === 'EFECTIVO') return 'bi-cash';
    if (m === 'TRANSFERENCIA') return 'bi-phone';
    return 'bi-credit-card';
  }
}