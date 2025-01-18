import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ListDiscounts } from '../../models/products.inteface';

@Component({
  selector: 'app-discount-modal',
  templateUrl: './discount-modal.component.html',
  styleUrl: './discount-modal.component.css'
})
export class DiscountModalComponent {
  displayedColumns: string[] = ['name', 'description', 'value', 'products'];
  nonGlobalDiscounts: ListDiscounts[]; // Nueva propiedad para descuentos no globales
  auxData: any; // Propiedad para almacenar la variable aux

  constructor(
    public dialogRef: MatDialogRef<DiscountModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { descuentos: ListDiscounts[], aux: any }
  ) {
    // Filtramos solo los descuentos no globales
    this.nonGlobalDiscounts = data.descuentos.filter((discount) => !discount.isGlobal);
    this.auxData = data.aux; // Asignamos aux a una propiedad del componente 
    console.log(this.auxData)
  }

  close(): void {
    this.dialogRef.close();
  }

  getProductsAsString(products: { _id: string; name: string }[]): string {
    return products.length > 0 ? products.map((product) => product.name).join(', ') : 'N/A';
  }
}
