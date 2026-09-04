import { Component, Inject } from '@angular/core';
import { MovementDetailModalComponent } from '../movement-detail-modal/movement-detail-modal.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CashSessionService } from '../../service/cash-session/cash-session.service';

@Component({
  selector: 'app-cash-movements-modal',
  templateUrl: './cash-movements-modal.component.html',
  styleUrl: './cash-movements-modal.component.css'
})
export class CashMovementsModalComponent {
  movements: any[] = [];
  page = 1;
  limit = 10;
  totalPages = 1;
  totalDocs = 0;
  loading = false;

  displayedColumns: string[] = ['createdAt', 'type', 'amount', 'description', 'createdBy', 'actions'];

  constructor(
    private dialogRef: MatDialogRef<CashMovementsModalComponent>,
    private dialog: MatDialog,
    private cashSessionService: CashSessionService,
    @Inject(MAT_DIALOG_DATA) public data: { sessionId: string }
  ) { }

  async ngOnInit(): Promise<void> {
    await this.loadMovements();
  }

  async loadMovements(): Promise<void> {
    this.loading = true;
    try {
      const result = await this.cashSessionService.getMovementsBySession(this.data.sessionId, this.page, this.limit);
      this.movements = result.docs;
      this.totalPages = result.totalPages;
      this.totalDocs = result.totalDocs;
    } finally {
      this.loading = false;
    }
  }

  goToPage(p: number): void {
    if (p < 1 || p > this.totalPages) return;
    this.page = p;
    this.loadMovements();
  }

  viewDetail(movementId: string): void {
    this.dialog.open(MovementDetailModalComponent, {
      width: '600px',
      data: { movementId }
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
