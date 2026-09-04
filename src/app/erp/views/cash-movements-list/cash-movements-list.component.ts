import { Component } from '@angular/core';
import { CashSessionService } from '../../service/cash-session/cash-session.service';
import { ActivatedRoute } from '@angular/router';
import { MovementDetailModalComponent } from '../../layout/movement-detail-modal/movement-detail-modal.component';
import { ImageViewerModalComponentComponent } from '../../layout/image-viewer-modal.component/image-viewer-modal.component.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-cash-movements-list',
  templateUrl: './cash-movements-list.component.html',
  styleUrl: './cash-movements-list.component.css'
})
export class CashMovementsListComponent {
  movements: any[] = [];
  sessions: any[] = []; // para el selector
  page = 1;
  limit = 15;
  totalPages = 1;
  totalDocs = 0;
  sessionId = '';
  loading = false;
  loadingSessions = false;

  displayedColumns: string[] = ['createdAt', 'type', 'amount', 'description', 'createdBy', 'attachments', 'actions'];

  constructor(
    private cashSessionService: CashSessionService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) { }

  async ngOnInit(): Promise<void> {
    this.sessionId = this.route.snapshot.queryParamMap.get('sessionId') || '';
    await this.loadSessions();

    if (!this.sessionId && this.sessions.length) {
      this.sessionId = this.sessions[0]._id; // por defecto, la sesión más reciente
    }
    if (this.sessionId) {
      await this.loadMovements();
    }
  }

  async loadSessions(): Promise<void> {
    this.loadingSessions = true;
    try {
      const result = await this.cashSessionService.listSessions(1, 30);
      this.sessions = result.docs;
    } finally {
      this.loadingSessions = false;
    }
  }

  async loadMovements(): Promise<void> {
    if (!this.sessionId) return;
    this.loading = true;
    try {
      const result = await this.cashSessionService.getMovementsBySession(this.sessionId, this.page, this.limit);
      this.movements = result.docs;
      this.totalPages = result.totalPages;
      this.totalDocs = result.totalDocs;
    } finally {
      this.loading = false;
    }
  }

  onSessionChange(): void {
    this.page = 1;
    this.loadMovements();
  }

  goToPage(p: number): void {
    if (p < 1 || p > this.totalPages) return;
    this.page = p;
    this.loadMovements();
  }

  isImage(url: string): boolean {
    return /\.(jpe?g|png|webp)(\?|$)/i.test(url);
  }

  openAttachment(url: string): void {
    this.dialog.open(ImageViewerModalComponentComponent, {
      data: { url },
      panelClass: 'image-viewer-panel',
      maxWidth: '95vw',
      maxHeight: '95vh'
    });
  }

  viewDetail(movementId: string): void {
    this.dialog.open(MovementDetailModalComponent, {
      width: '600px',
      data: { movementId }
    });
  }
}
