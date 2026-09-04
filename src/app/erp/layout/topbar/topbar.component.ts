import { Component, ElementRef, HostListener } from '@angular/core';

import { SidebarService } from '../../service/sidebar/sidebar.service';
import { AuthService } from '../../../service/auth/auth.service';
import { ProductsService } from '../../service/products/products.service';
import { CashSessionService } from '../../service/cash-session/cash-session.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CashSessionModalComponent } from '../cash-session-modal/cash-session-modal.component';
import { CashSessionCloseModalComponent } from '../cash-session-close-modal/cash-session-close-modal.component';
import { Subscription } from 'rxjs';
import { CashMovementModalComponent } from '../cash-movement-modal/cash-movement-modal.component';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css'
})
export class TopbarComponent {
  user: any;
  notifications: any[] = [];
  showDropdown = false;
  cashSessionStatus: any = null;
  private statusSub!: Subscription;
  private issueSub!: Subscription;
  private activeCashModalRef: MatDialogRef<any> | null = null;
  constructor(
    private sidebarService: SidebarService,
    private authService: AuthService,
    private productService: ProductsService,
    private cashSessionService: CashSessionService,
    private dialog: MatDialog,
    private elementRef: ElementRef
  ) { }

  async ngOnInit(): Promise<void> {
    const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
    }

    if (this.user?.username !== 'byronp') {
      this.loadNotifications();
    }

    if (this.isOnlyHairdresser()) {
      return;
    }

    this.statusSub = this.cashSessionService.status$.subscribe((status) => {
      this.cashSessionStatus = status;

      if (this.needsToOpenCash || this.needsToClosePendingSession || this.alreadyClosedTodayInfo) {
        this.openCashModal();
      }
    });

    await this.cashSessionService.getStatus();

    this.issueSub = this.cashSessionService.sessionIssue$.subscribe(async () => {
      await this.cashSessionService.getStatus();
      this.openCashModal();
    });
  }

  ngOnDestroy(): void {
    if (this.statusSub) this.statusSub.unsubscribe();
    if (this.issueSub) this.issueSub.unsubscribe();
  }

  logout(): void {
    this.authService.logout();
  }

  toggleSidebar(): void {
    this.sidebarService.toggleMinimized();
  }

  async loadNotifications(): Promise<void> {
    const data = await this.productService.listExpiredProducts();

    const now = new Date();

    this.notifications = data.map((item: any) => {
      const expDate = new Date(item.expirationDate);
      return {
        ...item,
        status: expDate < now ? 'expired' : 'near'
      };
    });
  }

  get totalAlerts(): number {
    return this.notifications.length;
  }

  toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.showDropdown = !this.showDropdown;
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showDropdown = false;
    }
  }

  // 🔹 nuevo: mismo criterio que en el sidebar
  isOnlyHairdresser(): boolean {
    const isHairdresser = this.authService.hasRole(['HAIRDRESSER']);
    const hasOtherAccessRole = this.authService.hasRole(['ADMIN', 'SUPERVISOR', 'CASHIER', 'MANAGER']);
    return isHairdresser && !hasOtherAccessRole;
  }

  async loadCashSessionStatus(): Promise<void> {
    try {
      this.cashSessionStatus = await this.cashSessionService.getStatus();
    } catch (error) {
      console.error('Error cargando estado de caja', error);
    }
  }

  get needsToOpenCash(): boolean {
    return this.cashSessionStatus &&
      !this.cashSessionStatus.hasActiveSession &&
      !this.cashSessionStatus.needsToClosePending &&
      !this.cashSessionStatus.alreadyClosedToday && // 🔹 nuevo: bloquea el modal de apertura normal
      this.cashSessionStatus.isWithinMandatoryWindow;
  }

  get needsToClosePendingSession(): boolean {
    return !!this.cashSessionStatus?.needsToClosePending;
  }
  // 🔹 nuevo
  get alreadyClosedTodayInfo(): boolean {
    return this.cashSessionStatus &&
      !this.cashSessionStatus.hasActiveSession &&
      !this.cashSessionStatus.needsToClosePending &&
      !!this.cashSessionStatus.alreadyClosedToday;
  }

  // 🔹 nuevo: útil si hay un botón manual de "Abrir caja" en el menú
  get outsideWindowInfo(): boolean {
    return this.cashSessionStatus &&
      !this.cashSessionStatus.hasActiveSession &&
      !this.cashSessionStatus.needsToClosePending &&
      !this.cashSessionStatus.alreadyClosedToday &&
      !this.cashSessionStatus.isWithinMandatoryWindow;
  }

  openCashModal(): void {
    // 🔹 nuevo: si ya hay uno abierto, no abrir otro
    if (this.activeCashModalRef) {
      return;
    }

    const dialogRef = this.dialog.open(CashSessionModalComponent, {
      width: '400px',
      disableClose: this.needsToClosePendingSession,
      data: {
        needsToClosePending: this.needsToClosePendingSession,
        pendingSession: this.cashSessionStatus?.pendingSession,
        alreadyClosedToday: this.alreadyClosedTodayInfo,
        outsideWindow: this.outsideWindowInfo,
      }
    });

    this.activeCashModalRef = dialogRef; // 🔹 nuevo

    dialogRef.afterClosed().subscribe(async (result) => {
      this.activeCashModalRef = null; // 🔹 nuevo: liberar la referencia siempre, se haya confirmado o cancelado

      if (result) {
        await this.loadCashSessionStatus();
      }
    });
  }

  openCloseCashModal(): void {
    const dialogRef = this.dialog.open(CashSessionCloseModalComponent, {
      width: '450px',
      disableClose: true,
      data: {
        currentExpectedCash: this.cashSessionStatus?.currentExpectedCash || 0
      }
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        await this.loadCashSessionStatus();
      }
    });
  }

  openCashMovementModal(): void {
    const dialogRef = this.dialog.open(CashMovementModalComponent, {
      width: '480px',
      disableClose: true,
      data: {
        sessionId: this.cashSessionStatus?.session?._id
      }
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        await this.loadCashSessionStatus();
      }
    });
  }
}