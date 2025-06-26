import { Component, Inject, Output, EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ModalService } from '../../service/modal/modal.service';
@Component({
  selector: 'app-dynamic-modal-input',
  templateUrl: './dynamic-modal-input.component.html',
  styleUrl: './dynamic-modal-input.component.css'
})
export class DynamicModalInputComponent {
   constructor(
    public modalService: ModalService,
    public dialogRef: MatDialogRef<DynamicModalInputComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    // Si viene con una vista específica desde el servicio
    if (this.data.contentType) {
      this.modalService.changeView(this.data.contentType);
    }
  }

  onSubmit(event: any) {
    // Lógica para manejar el submit
    this.dialogRef.close(event);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
