import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog'; 
import { ModalService } from '../../service/modal/modal.service';

@Component({
  selector: 'app-product-input',
  templateUrl: './product-input.component.html',
  styleUrl: './product-input.component.css'
})
export class ProductInputComponent {
    constructor(private dialog: MatDialog,private modalService: ModalService) {}






  abrirModalIngreso() {
    const dialogRef = this.modalService.openIngresoModal();
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Ingreso guardado:', result);
      }
    });
  }
}
