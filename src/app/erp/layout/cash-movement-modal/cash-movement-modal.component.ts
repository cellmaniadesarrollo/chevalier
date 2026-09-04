import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CashSessionService } from '../../service/cash-session/cash-session.service';
import { CameraCaptureModalComponent } from '../camera-capture-modal/camera-capture-modal.component';
interface FilePreview {
  file: File;
  previewUrl: string;
}

@Component({
  selector: 'app-cash-movement-modal',
  templateUrl: './cash-movement-modal.component.html',
  styleUrl: './cash-movement-modal.component.css'
})
export class CashMovementModalComponent {
  type: 'income' | 'expense' = 'expense';
  amount: number | null = null;
  description: string = '';

  files: FilePreview[] = [];
  isDragging = false;
  submitting = false;
  errorMessage = '';

  readonly MAX_FILES = 5;
  readonly MAX_SIZE_MB = 5;
  readonly ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

  constructor(
    private dialogRef: MatDialogRef<CashMovementModalComponent>,
    private cashSessionService: CashSessionService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: { sessionId: string }
  ) { }

  // ---------- Drag & Drop ----------
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
    if (event.dataTransfer?.files?.length) {
      this.handleFiles(event.dataTransfer.files);
    }
  }

  // ---------- Selección manual / cámara ----------
  onFileInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.handleFiles(input.files);
    }
    input.value = ''; // permite volver a seleccionar el mismo archivo
  }

  private handleFiles(fileList: FileList): void {
    this.errorMessage = '';
    const incoming = Array.from(fileList);

    for (const file of incoming) {
      if (this.files.length >= this.MAX_FILES) {
        this.errorMessage = `Máximo ${this.MAX_FILES} archivos.`;
        break;
      }
      if (!this.ALLOWED_TYPES.includes(file.type)) {
        this.errorMessage = 'Solo se permiten imágenes (JPG, PNG, WEBP) o PDF.';
        continue;
      }
      if (file.size > this.MAX_SIZE_MB * 1024 * 1024) {
        this.errorMessage = `"${file.name}" supera los ${this.MAX_SIZE_MB}MB.`;
        continue;
      }

      const previewUrl = file.type === 'application/pdf'
        ? 'assets/img/pdf-icon.png' // ícono genérico para PDF, ajustá la ruta a tu proyecto
        : URL.createObjectURL(file);

      this.files.push({ file, previewUrl });
    }
  }

  removeFile(index: number): void {
    const removed = this.files[index];
    if (removed.previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(removed.previewUrl);
    }
    this.files.splice(index, 1);
  }

  // ---------- Submit ----------
  get isValid(): boolean {
    return !!this.amount && this.amount > 0 && !!this.description.trim();
  }

  async submit(): Promise<void> {
    if (!this.isValid || this.submitting) return;

    this.submitting = true;
    this.errorMessage = '';

    try {
      await this.cashSessionService.createMovement({
        session: this.data.sessionId,
        type: this.type,
        amount: this.amount!,
        description: this.description.trim(),
        files: this.files.map(f => f.file),
      });

      this.dialogRef.close(true);
    } catch (error: any) {
      this.errorMessage = error?.response?.data?.message || 'Error al registrar el movimiento.';
    } finally {
      this.submitting = false;
    }
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  openCameraModal(): void {
    if (this.files.length >= this.MAX_FILES) {
      this.errorMessage = `Máximo ${this.MAX_FILES} archivos.`;
      return;
    }

    const cameraRef = this.dialog.open(CameraCaptureModalComponent, {
      width: '480px',
      maxWidth: '95vw',
      panelClass: 'camera-dialog-panel', // opcional, para quitar padding default del mat-dialog
      disableClose: false,
    });

    cameraRef.afterClosed().subscribe((file: File | null) => {
      if (file) {
        this.files.push({
          file,
          previewUrl: URL.createObjectURL(file),
        });
        this.errorMessage = '';
      }
    });
  }

}
