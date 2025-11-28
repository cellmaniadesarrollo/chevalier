import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { DiscountsService } from '../../service/discounts/discounts.service';
import { ModalService } from '../../service/modal/modal.service';

@Component({
  selector: 'app-dicounts-list',
  templateUrl: './dicounts-list.component.html',
  styleUrl: './dicounts-list.component.css'
})
export class DicountsListComponent {
displayedColumns: string[] = ['name', 'description', 'value','from','util','global'];
  searchTerm: string = '';
  filteredDiscounts: any[] = [];
  totalClients: number = 0;
  pageSize: number = 30;
  currentPage: number = 1;

  constructor(private discountsService: DiscountsService,private modalservice:ModalService) {}

  ngOnInit(): void {
    this.loadDiscounts() 
  }

  async loadDiscounts() {
    try {
      const result = await this.discountsService.lisdiscounts(
        this.currentPage,
        this.pageSize,
        this.searchTerm
      );
      this.filteredDiscounts = result.data;
      this.totalClients = result.total;
    } catch (error) {
      console.error('Error al cargar clientes:', error);
    }
  }
 applyFilters() {
    this.currentPage = 1; // reset paginación al filtrar
     this.loadDiscounts() 
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
     this.loadDiscounts() 
  }

abrirModalEditarDescuento(data: any) {
  this.modalservice.abrirModalEditardescuento(data).afterClosed().subscribe((result) => {
    if (result === 'updated') {   // 🔹 Recibir señal desde modal
       this.loadDiscounts()        // 👉 Recarga clientes
    }
  });
}
abrirModalCrearDescuento() {
  this.modalservice.abrirModalEditardescuento().afterClosed().subscribe((result) => {
    if (result === 'updated') {   // 🔹 Recibir señal desde modal
       this.loadDiscounts()        // 👉 Recarga clientes
    }
  });
}
  toDatetimeLocal(dateString: string) {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);

    return `${day}-${month}-${year} ${hours}:${minutes}`;
  }
}
