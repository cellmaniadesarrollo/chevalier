import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { CashSessionService } from '../../service/cash-session/cash-session.service';
import { CashSessionCloseModalComponent } from '../cash-session-close-modal/cash-session-close-modal.component';


@Component({
  selector: 'app-cash-session-modal',
  templateUrl: './cash-session-modal.component.html',
  styleUrl: './cash-session-modal.component.css'
})
export class CashSessionModalComponent {
  declaredOpeningAmount: number | null = null;
  errorMessage: string = '';
  loading = false;

  preview: any = null;
  previewLoading = true;

  constructor(
    public dialogRef: MatDialogRef<CashSessionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { needsToClosePending: boolean; pendingSession?: any },
    private cashSessionService: CashSessionService,
    private dialog: MatDialog // 🔹 nuevo
  ) { }

  async ngOnInit(): Promise<void> {
    if (this.data.needsToClosePending) return;

    try {
      this.preview = await this.cashSessionService.getOpeningPreview();
      this.declaredOpeningAmount = this.preview?.expectedOpeningAmount ?? null;
    } catch (error) {
      console.error('Error cargando preview de apertura', error);
    } finally {
      this.previewLoading = false;
    }
  }

  cancel(): void {
    this.dialogRef.close(null);
  }

  // 🔹 nuevo: abre el modal de cierre para la sesión pendiente
  openCloseModal(): void {
    const closeRef = this.dialog.open(CashSessionCloseModalComponent, {
      width: '450px',
      disableClose: true,
      data: {
        currentExpectedCash: this.data.pendingSession?.declaredOpeningAmount || 0,
        pendingSession: this.data.pendingSession, // por si el modal de cierre quiere mostrar detalles
      }
    });

    // cerramos ESTE modal (el de alerta) ya, para que no quede debajo tapando la pantalla
    this.dialogRef.close(null);

    closeRef.afterClosed().subscribe((result) => {
      // si cerró exitosamente, el topbar ya escucha sessionIssue$/status$ y se refresca solo,
      // pero por las dudas forzamos un refresh de status si el modal de cierre no lo hace internamente
      if (result) {
        this.cashSessionService.refreshStatus();
      }
    });
  }

  async confirmOpen(): Promise<void> {
    this.errorMessage = '';
    if (this.declaredOpeningAmount === null) {
      this.errorMessage = 'Debe ingresar el monto con el que abre caja.';
      return;
    }
    this.loading = true;
    try {
      const result = await this.cashSessionService.open({ declaredOpeningAmount: this.declaredOpeningAmount });
      this.dialogRef.close(result);
    } catch (error: any) {
      this.errorMessage = error?.response?.data?.message || 'Error al abrir la caja.';
    } finally {
      this.loading = false;
    }
  }
  get expectedOpeningAmount(): number {
    return this.preview?.expectedOpeningAmount ?? 0; // ajustar al nombre real del campo
  }

  selectAll(event: FocusEvent): void {
    (event.target as HTMLInputElement).select();
  }
}
