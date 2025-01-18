import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { SalesService } from '../../service/sales/sales.service';
import { ListSalesI, ListTypeproductserviceI } from '../../models/sales.interface';
import { ListHairdresserI } from '../../models/hairdresser.interface';





@Component({
  selector: 'app-sales-list',
  templateUrl: './sales-list.component.html',
  styleUrls: ['./sales-list.component.css']
})
export class SalesListComponent implements OnInit {
  sales: ListSalesI[] = [];
  filteredSales = new MatTableDataSource<ListSalesI>([]);
  displayedColumns: string[] = ['saleNumber', 'productService', 'saleDate', 'barber', 'seller', 'client', 'total', 'print'];
  barbers: ListHairdresserI[] = [];
  productorservices: ListTypeproductserviceI[] = [];
  selectedBarber: string | null = null;
  selectedType: string | null = null;
  searchTerm: string = '';
  pageSize = 30;
  currentPage = 1;
totalsales=0
  constructor(private salesservice: SalesService) { }

  ngOnInit(): void {
    this.applyFilters();  // Llama a los filtros cuando el componente se inicializa
  }

  async getSalesDataList(filters: any = {}): Promise<void> {
    const data = await this.salesservice.Saleslist({
      page: this.currentPage,
      limit: this.pageSize,
      filters
    });
    this.totalsales=data.total
    this.sales = data.products;
    this.filteredSales.data = this.sales;
    this.barbers = data.hairdresser;
    this.productorservices = data.getproductservicestypes; 
  }

  applyFilters(): void {
    const filters: any = {};
    if (this.selectedBarber) filters.barberId = this.selectedBarber;
    if (this.selectedType) filters.productType = this.selectedType;
    if (this.searchTerm.trim()) filters.saleNumber = this.searchTerm;

    this.getSalesDataList(filters);
  }

  onPageChange(event: PageEvent): void { 
    this.pageSize = event.pageSize;      // Nuevo tamaño de página
    this.currentPage = event.pageIndex + 1; // Nueva página (0-indexada, ajustada a 1-indexada)
    this.applyFilters(); // Recarga los datos con los filtros actuales
  }
async  printTicket(sale: any){
  try {
    const datas =await this.salesservice.Salesgetdataprintticket({id:sale})
    await this.salesservice.Salesprintticket(datas) 
} catch (error) {
  console.log(error)
}

  }

}