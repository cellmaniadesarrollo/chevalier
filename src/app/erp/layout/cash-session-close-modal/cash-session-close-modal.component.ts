import { Component, Inject, OnInit } from '@angular/core';
import { CashSessionService } from '../../service/cash-session/cash-session.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-cash-session-close-modal',
  templateUrl: './cash-session-close-modal.component.html',
  styleUrl: './cash-session-close-modal.component.css'
})
export class CashSessionCloseModalComponent implements OnInit {
  countedAmount: number | null = null;
  cashDelivered: number | null = null;
  cashLeftForNextDay: number | null = null;
  notes: string = '';

  errorMessage: string = '';
  deliveryMismatchWarning: boolean = false;
  loading = false;

  constructor(
    public dialogRef: MatDialogRef<CashSessionCloseModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { currentExpectedCash: number },
    private cashSessionService: CashSessionService
  ) { }

  ngOnInit(): void {
    // 🔹 Precargamos el monto contado con el esperado; el cajero lo ajusta si difiere
    this.countedAmount = this.round2(this.data.currentExpectedCash);
    this.onCountedAmountChange();
  }

  get manualDifference(): number | null {
    if (this.countedAmount === null) return null;
    return this.countedAmount - this.data.currentExpectedCash;
  }

  onCountedAmountChange(): void {
    if (this.countedAmount === null) {
      this.cashLeftForNextDay = null;
      return;
    }
    if (this.cashDelivered === null) {
      this.cashDelivered = 0;
    }
    this.recalculateLeftForNextDay();
  }

  onCashDeliveredChange(): void {
    this.recalculateLeftForNextDay();
  }

  onCashLeftForNextDayChange(): void {
    if (this.countedAmount === null || this.cashLeftForNextDay === null) return;
    this.cashDelivered = this.round2(this.countedAmount - this.cashLeftForNextDay);
  }

  private recalculateLeftForNextDay(): void {
    if (this.countedAmount === null || this.cashDelivered === null) return;
    this.cashLeftForNextDay = this.round2(this.countedAmount - this.cashDelivered);
  }

  private round2(value: number): number {
    return Math.round(value * 100) / 100;
  }

  selectAll(event: FocusEvent): void {
    const input = event.target as HTMLInputElement;
    input.select();
  }

  cancel(): void {
    this.dialogRef.close(null);
  }

  async confirmClose(): Promise<void> {
    this.errorMessage = '';
    this.deliveryMismatchWarning = false;

    if (this.countedAmount === null || this.cashDelivered === null || this.cashLeftForNextDay === null) {
      this.errorMessage = 'Debe ingresar el monto contado, el entregado y el fondo para el día siguiente.';
      return;
    }

    this.loading = true;
    try {
      const result = await this.cashSessionService.close({
        countedAmount: this.countedAmount,
        cashDelivered: this.cashDelivered,
        cashLeftForNextDay: this.cashLeftForNextDay,
        notes: this.notes
      });

      if (result.deliveryMismatch) {
        this.deliveryMismatchWarning = true;
        this.loading = false;
        setTimeout(() => this.dialogRef.close(result), 2500);
        return;
      }

      this.dialogRef.close(result);
    } catch (error: any) {
      this.errorMessage = error?.response?.data?.message || 'Error al cerrar la caja.';
    } finally {
      this.loading = false;
    }
  }
}