import { Component, Inject } from '@angular/core';
import { ImageViewerModalComponentComponent } from '../image-viewer-modal.component/image-viewer-modal.component.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CashSessionService } from '../../service/cash-session/cash-session.service';

@Component({
  selector: 'app-movement-detail-modal',
  templateUrl: './movement-detail-modal.component.html',
  styleUrl: './movement-detail-modal.component.css'
})
export class MovementDetailModalComponent {
  movement: any = null;
  loading = false;

  constructor(
    private dialogRef: MatDialogRef<MovementDetailModalComponent>,
    private dialog: MatDialog,
    private cashSessionService: CashSessionService,
    @Inject(MAT_DIALOG_DATA) public data: { movementId: string }
  ) { }

  async ngOnInit(): Promise<void> {
    this.loading = true;
    try {
      this.movement = await this.cashSessionService.getMovementDetail(this.data.movementId);
    } finally {
      this.loading = false;
    }
  }

  isImage(url: string): boolean {
    return /\.(png|jpe?g|gif|webp)(\?|$)/i.test(url);
  }

  viewImage(url: string): void {
    this.dialog.open(ImageViewerModalComponentComponent, {
      data: { url },
      panelClass: 'image-viewer-panel',
      maxWidth: '95vw',
      maxHeight: '95vh'
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
