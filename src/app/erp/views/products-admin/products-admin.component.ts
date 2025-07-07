import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ProductCreateModalComponent } from '../../layout/product-create-modal/product-create-modal.component';
import { ProductsService } from '../../service/products/products.service';

interface Producto {
  codigo: string;
  name: string;
  tipo: string;
  precio: number;
}
interface typoProducto{
  id:string;
  name:string
}
@Component({
  selector: 'app-products-admin',
  templateUrl: './products-admin.component.html',
  styleUrl: './products-admin.component.css'
})
export class ProductsAdminComponent {
  constructor(private dialog: MatDialog, private productService: ProductsService) { 
  }
  filters = {
    searchQuery: '',       // Para el buscador (input text)
    category: '',           // Para el select de categorías
    page: 1,               // Página actual
    itemsPerPage: 30       // Items por página
  };

  totalItems = 0;
  totalPages = 1;
  products:Producto[]=[]
  typos:typoProducto[]=[]
    displayedColumns: string[] = ['code','name',  'price','comision','tipo','stock' , 'actions'];
  ngOnInit(): void {
    this.loadProductos()
  }
  async loadProductos() {
    const { searchQuery, category, page, itemsPerPage } = this.filters;
    const data = await this.productService.lisproducts({ searchQuery, category, page, itemsPerPage }) 
    this.products= data.items.data
    this.totalItems=data.items.metadata[0].total
this.totalPages = Math.ceil(data.items.metadata[0].total / this.filters.itemsPerPage);
    console.log(data.items)
    this.typos=data.types
  }
  cambiarPagina(nuevaPagina: number) {
    this.filters.page = nuevaPagina;
    this.loadProductos();
  }



  crearProducto() {
    const dialogRef = this.dialog.open(ProductCreateModalComponent, {
      width: '800px',
      height: '600px',
      disableClose: true
    });
    dialogRef.keydownEvents().subscribe(event => {
      if (event.key === 'Escape' || event.key === 'Esc') {
        dialogRef.close();
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Producto creado:', result);
        // Aquí puedes guardar el producto o hacer lo que necesites
      }
    });

  }
}
