import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalService } from '../../service/modal/modal.service';
import { PageEvent } from '@angular/material/paginator';
import { ProductsService } from '../../service/products/products.service';
import { VoucherDetail } from '../../models/insert.interface';
@Component({
  selector: 'app-product-input',
  templateUrl: './product-input.component.html',
  styleUrl: './product-input.component.css'
})
export class ProductInputComponent {
  constructor(private dialog: MatDialog, private modalService: ModalService, private backend: ProductsService) { }



  filters = {
    searchQuery: '',
    category: '',
    page: 1,
    itemsPerPage: 30
  };


  totalItems = 0;
  productos: VoucherDetail[] = [];
  displayedColumns: string[] = [
    'comprobanteNumero',
    'fechaEmision',
    'codigoProducto',
    'nombreProducto',
    'cantidad',
    'precioUnitario',
    'impuesto',
    'totalLinea',
    'fechaVencimiento',
    'lote'
  ];// Actualiza según tus columnas
  typos: any[] = []; // Se llena desde el backend con las categorías

  ngOnInit(): void { 
    this.loadProductos();
  }

 

  async loadProductos() {
    const data = await this.backend.listProductsIncome(this.filters)
    this.productos = data.data
    this.totalItems = data.metadata[0].total; 
    console.log(data)
  }

  onPageChange(event: PageEvent) {
    this.filters.page = event.pageIndex + 1;
    this.filters.itemsPerPage = event.pageSize;
    this.loadProductos();
  }

  onFilterChange() {
    this.filters.page = 1;
    this.loadProductos();
  }

  abrirModalIngreso() {
    const dialogRef = this.modalService.openIngresoModal();

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Ingreso guardado:', result);
      }
    });
  }
}
