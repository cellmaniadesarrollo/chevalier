import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-etiquetas-cantidad-dialog',
  templateUrl: './etiquetas-cantidad-dialog.component.html',
  styleUrl: './etiquetas-cantidad-dialog.component.css'
})
export class EtiquetasCantidadDialogComponent {
form: FormGroup;

constructor(
  public dialogRef: MatDialogRef<EtiquetasCantidadDialogComponent>,
  @Inject(MAT_DIALOG_DATA) public data: any,
  private fb: FormBuilder
) {
  const initial = data.initialValue ?? 1;

  this.form = this.fb.group({
    cantidad: [initial, [Validators.required, Validators.min(1)]]
  });
}
  cancelar(): void {
    this.dialogRef.close();
  }

  aceptar(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value.cantidad);
    }
  }

}
