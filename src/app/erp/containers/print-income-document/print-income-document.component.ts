import { Component, HostListener, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'; 
import { ProductsService } from '../../service/products/products.service';
@Component({
  selector: 'app-print-income-document',
  templateUrl: './print-income-document.component.html',
  styleUrl: './print-income-document.component.css'
})
export class PrintIncomeDocumentComponent {

  constructor(
    public dialogRef: MatDialogRef<PrintIncomeDocumentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private api:ProductsService
  ) {}

  ngOnInit() {
    console.log('ID recibido:', this.data);
  }

  // 👉 Cerrar modal con ESC
@HostListener('document:keydown.escape', ['$event'])
onEscapePressed(event: Event) {
  event.preventDefault();
  this.closeModal();
}

  // Cerrar modal
  closeModal() {
    this.dialogRef.close();
  }

// Acción imprimir
async printDocument() {
  console.log('Imprimir documento con ID:', this.data);

  const base64Pdf = await this.api.PrintDocumentIncome(this.data.id); // <-- base64

  // Llamar a la función que abre el PDF
  this.openPdfInNewTab(base64Pdf);

  this.dialogRef.close('printed');
}

openPdfInNewTab(base64: string) {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length)
    .fill(null)
    .map((_, i) => byteCharacters.charCodeAt(i));

  const byteArray = new Uint8Array(byteNumbers);

  const blob = new Blob([byteArray], { type: 'application/pdf' });
  const blobUrl = URL.createObjectURL(blob);

  window.open(blobUrl, '_blank');
}
}
