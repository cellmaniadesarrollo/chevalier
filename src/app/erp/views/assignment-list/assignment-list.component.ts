import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ProductsService } from '../../service/products/products.service';
import { ListHairdresserI } from '../../models/hairdresser.interface';

@Component({
  selector: 'app-assignment-list',
  templateUrl: './assignment-list.component.html',
  styleUrl: './assignment-list.component.css'
})
export class AssignmentListComponent {
  constructor(private productsservice: ProductsService) { }
  displayedColumns: string[] = ['producto', 'lote', 'cantidad', 'fecha', 'entregadoPor', 'destinatario', 'observaciones'];
  asignaciones: any[] = [];
  totalAsignaciones = 0;
  barbero: ListHairdresserI[] = []

  filters = {
    searchQuery: '',
    page: 1,
    pageSize: 30,
    filter: ''
  };

  ngOnInit(): void {
    this.loadAsignaciones();
  }

  async loadAsignaciones() {
    try {
      const response = await this.productsservice.listBarberSuppliesTracker(this.filters);

      this.barbero = response.hairdresser
      // Asigna los productos a la variable de la tabla
      this.asignaciones = response.items.products;

      // Asigna el total desde el backend para paginación
      this.totalAsignaciones = response.items.metadata?.[0]?.total || 0;

    } catch (error) {
      console.error('Error al cargar asignaciones:', error);
    }
  }

  onPageChange(event: PageEvent): void {
    this.filters.page = event.pageIndex + 1;
    this.filters.pageSize = event.pageSize;
    this.loadAsignaciones();
  }


}
