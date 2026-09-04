import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-image-viewer-modal.component',
  templateUrl: './image-viewer-modal.component.component.html',
  styleUrl: './image-viewer-modal.component.component.css'
})
export class ImageViewerModalComponentComponent {
  constructor(
    private dialogRef: MatDialogRef<ImageViewerModalComponentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { url: string }
  ) { }

  close(): void {
    this.dialogRef.close();
  }
}
