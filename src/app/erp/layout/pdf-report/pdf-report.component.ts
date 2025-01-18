import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SalesService } from '../../service/sales/sales.service';
@Component({
  selector: 'app-pdf-report',
  templateUrl: './pdf-report.component.html',
  styleUrl: './pdf-report.component.css'
})
export class PdfReportComponent {
  constructor(private salesservice: SalesService,
    public dialogRef: MatDialogRef<PdfReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any  // Recibe los datos enviados 
  ) { } 
  datos = {
    title: '',
    date: ''
  }
  ngOnInit(): void {
    this.datos = {
      title: this.data.nombrebarbero,
      date: this.data.fecha ? `${this.data.fecha.start} - ${this.data.fecha.end}` : "TODAS"
    }
    delete this.data.nombrebarbero;
  }



  // Función para el botón de Reporte Resumido
 async generarReporteResumido()  {
  try {
    // Llama al servicio para obtener el PDF en base64
    const report = await this.salesservice.Salesreportsminimal(this.data);

    if (report && report.pdfBase64) {  // Asegúrate de que el PDF esté en el objeto report
      // Convierte el base64 a un Blob
      const byteCharacters = atob(report.pdfBase64);
      const byteNumbers = new Array(byteCharacters.length);
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });

      // Crea una URL para el Blob
      const blobUrl = window.URL.createObjectURL(blob);

      // Abre el PDF en una nueva pestaña
      window.open(blobUrl, '_blank');

      // Opcionalmente, libera la memoria cuando ya no necesites la URL del Blob
      // window.URL.revokeObjectURL(blobUrl);
    } else {
      console.error('No se pudo obtener el PDF.');
    }
  } catch (error) {
    console.error('Error al generar el reporte:', error);
  }

  }

  // Función para el botón de Reporte Detallado
 async generarReporteDetallado(){
    try {
      // Llama al servicio para obtener el PDF en base64
      const report = await this.salesservice.Salesreportsdetail(this.data);
  
      if (report && report.pdfBase64) {  // Asegúrate de que el PDF esté en el objeto report
        // Convierte el base64 a un Blob
        const byteCharacters = atob(report.pdfBase64);
        const byteNumbers = new Array(byteCharacters.length);
        
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
  
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
  
        // Crea una URL para el Blob
        const blobUrl = window.URL.createObjectURL(blob);
  
        // Abre el PDF en una nueva pestaña
        window.open(blobUrl, '_blank');
  
        // Opcionalmente, libera la memoria cuando ya no necesites la URL del Blob
        // window.URL.revokeObjectURL(blobUrl);
      } else {
        console.error('No se pudo obtener el PDF.');
      }
    } catch (error) {
      console.error('Error al generar el reporte:', error);
    }
  }
    // Función para el botón de Reporte Detallado
 async generarReporteMedio(){
  try {
    // Llama al servicio para obtener el PDF en base64
    const report = await this.salesservice.Salesreportsmedium(this.data);

    if (report && report.pdfBase64) {  // Asegúrate de que el PDF esté en el objeto report
      // Convierte el base64 a un Blob
      const byteCharacters = atob(report.pdfBase64);
      const byteNumbers = new Array(byteCharacters.length);
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });

      // Crea una URL para el Blob
      const blobUrl = window.URL.createObjectURL(blob);

      // Abre el PDF en una nueva pestaña
      window.open(blobUrl, '_blank');

      // Opcionalmente, libera la memoria cuando ya no necesites la URL del Blob
      // window.URL.revokeObjectURL(blobUrl);
    } else {
      console.error('No se pudo obtener el PDF.');
    }
  } catch (error) {
    console.error('Error al generar el reporte:', error);
  }
}
}
