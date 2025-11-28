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
    'lote',
    'imprimir' // <-- Nueva columna
  ];// Actualiza según tus columnas
  typos: any[] = []; // Se llena desde el backend con las categorías

  ngOnInit(): void {
    this.loadProductos();
  }



  async loadProductos() {
    const data = await this.backend.listProductsIncome(this.filters)
    this.productos = data.data
    this.totalItems = data.metadata[0].total;

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
        this.loadProductos()
      }
    });
  }
  async printTicket(data: any) {
    const item = await this.backend.getImtemPrintTicket([{ _id: data }]);
    console.log(item);
    const cantidad = await this.modalService.openCantidadDialog(item[0].cant); // ← valor editable inicial

    if (cantidad) {
      item[0].cant = cantidad;
      this.backend.printTicketChevalier(item[0])
    }
  }
  abrirModalImpresionDocumentoIngreso(id:any,numero:any) {
 

    const dialogRef = this.modalService.openIngresoPrintDocumentModal(id,numero) 
      dialogRef.afterClosed().subscribe(result => {
    console.log('Modal cerrado, resultado:', result);
  });
  }
}
