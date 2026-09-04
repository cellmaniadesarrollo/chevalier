import { Component } from '@angular/core';
import { CashSessionService } from '../../service/cash-session/cash-session.service';
import { Router } from '@angular/router';
import { CashMovementsModalComponent } from '../../layout/cash-movements-modal/cash-movements-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-cash-sessions-list',
  templateUrl: './cash-sessions-list.component.html',
  styleUrl: './cash-sessions-list.component.css'
})
export class CashSessionsListComponent {
  sessions: any[] = [];
  page = 1;
  limit = 15;
  totalPages = 1;
  totalDocs = 0;
  statusFilter = '';
  loading = false;

  displayedColumns: string[] = [
    'openingDate', 'openedBy', 'declaredOpeningAmount', 'openingDifference',
    'status', 'closingDate', 'closedBy', 'countedAmount', 'closingDifference', 'actions'
  ];

  constructor(private cashSessionService: CashSessionService, private dialog: MatDialog) { }

  async ngOnInit(): Promise<void> {
    await this.loadSessions();
  }

  async loadSessions(): Promise<void> {
    this.loading = true;
    try {
      const result = await this.cashSessionService.listSessions(this.page, this.limit, this.statusFilter || undefined);
      this.sessions = result.docs;
      this.totalPages = result.totalPages;
      this.totalDocs = result.totalDocs;
    } finally {
      this.loading = false;
    }
  }

  onFilterChange(): void {
    this.page = 1;
    this.loadSessions();
  }

  goToPage(p: number): void {
    if (p < 1 || p > this.totalPages) return;
    this.page = p;
    this.loadSessions();
  }

  viewMovements(sessionId: string): void {
    this.dialog.open(CashMovementsModalComponent, {
      width: '800px',
      maxWidth: '95vw',
      data: { sessionId }
    });
  }
}
