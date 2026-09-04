import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
type CameraState = 'requesting' | 'live' | 'denied' | 'error' | 'preview';
@Component({
  selector: 'app-camera-capture-modal',
  templateUrl: './camera-capture-modal.component.html',
  styleUrl: './camera-capture-modal.component.css'
})
export class CameraCaptureModalComponent {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;

  state: CameraState = 'requesting';
  errorMessage = '';

  private stream: MediaStream | null = null;
  capturedPhotoUrl: string | null = null;
  private capturedBlob: Blob | null = null;

  facingMode: 'environment' | 'user' = 'environment';

  constructor(
    private dialogRef: MatDialogRef<CameraCaptureModalComponent>,
    private cdr: ChangeDetectorRef
  ) { }

  ngAfterViewInit(): void {
    this.startCamera();
  }

  // ── Iniciar cámara / pedir permisos ─────────────────────────
  async startCamera(): Promise<void> {
    this.state = 'requesting';
    this.errorMessage = '';
    this.cdr.detectChanges();

    // liberar stream previo si existía (ej: al cambiar de cámara)
    this.stopStream();

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: this.facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false, // 🔹 solo fotos, no necesitamos audio
      });

      this.state = 'live';
      this.cdr.detectChanges();

      // el <video> se renderiza recién ahora que state === 'live'
      setTimeout(() => {
        if (this.videoElement) {
          this.videoElement.nativeElement.srcObject = this.stream;
        }
      });
    } catch (error: any) {
      console.error('Error accediendo a la cámara:', error);

      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        this.state = 'denied';
      } else if (error.name === 'NotFoundError') {
        this.state = 'error';
        this.errorMessage = 'No se encontró ninguna cámara en este dispositivo.';
      } else {
        this.state = 'error';
        this.errorMessage = 'No se pudo acceder a la cámara.';
      }
      this.cdr.detectChanges();
    }
  }

  // ── Alternar cámara frontal / trasera (mobile) ──────────────
  switchCamera(): void {
    this.facingMode = this.facingMode === 'environment' ? 'user' : 'environment';
    this.startCamera();
  }

  // ── Capturar foto ────────────────────────────────────────────
  capturePhoto(): void {
    if (!this.stream || this.state !== 'live') return;

    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) return;
      this.capturedBlob = blob;
      this.capturedPhotoUrl = URL.createObjectURL(blob);
      this.state = 'preview';
      this.cdr.detectChanges();
    }, 'image/jpeg', 0.92);
  }

  // ── Volver a tomar ───────────────────────────────────────────
  retake(): void {
    if (this.capturedPhotoUrl) {
      URL.revokeObjectURL(this.capturedPhotoUrl);
    }
    this.capturedPhotoUrl = null;
    this.capturedBlob = null;
    this.state = 'live';
  }

  // ── Confirmar y devolver el archivo ─────────────────────────
  confirm(): void {
    if (!this.capturedBlob) return;

    const file = new File([this.capturedBlob], `foto-${Date.now()}.jpg`, {
      type: 'image/jpeg',
    });

    this.dialogRef.close(file);
  }

  cancel(): void {
    this.dialogRef.close(null);
  }

  private stopStream(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }

  ngOnDestroy(): void {
    this.stopStream();
    if (this.capturedPhotoUrl) {
      URL.revokeObjectURL(this.capturedPhotoUrl);
    }
  }
}
