import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-product-options-modal',
  templateUrl: './product-options-modal.component.html',
  styleUrl: './product-options-modal.component.css'
})
export class ProductOptionsModalComponent {
  iddata:any=null
  selectedTabIndex = 0;

  constructor(public dialogRef: MatDialogRef<ProductOptionsModalComponent>,@Inject(MAT_DIALOG_DATA) public data: any) {
     this.iddata = data
    console.log('Datos recibidos:', data);
  }
    closeDialog(result?: any) {
    this.dialogRef.close(result); // Puedes pasar datos de vuelta si quieres
  }
}
