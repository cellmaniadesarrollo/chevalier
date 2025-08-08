import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ClientsService } from '../../service/clients/clients.service';
@Component({
  selector: 'app-clients-list',
  templateUrl: './clients-list.component.html',
  styleUrl: './clients-list.component.css'
})
export class ClientsListComponent {
displayedColumns: string[] = ['name', 'cedula', 'phone','dateOfBirth'];
  searchTerm: string = '';
  filteredClients: any[] = [];
  totalClients: number = 0;
  pageSize: number = 30;
  currentPage: number = 1;

  constructor(private clientService: ClientsService) {}

  ngOnInit(): void {
    this.loadClients();
  }

  async loadClients() {
    try {
      const result = await this.clientService.getClients(
        this.currentPage,
        this.pageSize,
        this.searchTerm
      );
      this.filteredClients = result.data;
      this.totalClients = result.total;
    } catch (error) {
      console.error('Error al cargar clientes:', error);
    }
  }
 applyFilters() {
    this.currentPage = 1; // reset paginación al filtrar
    this.loadClients();
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    this.loadClients();
  }
}
