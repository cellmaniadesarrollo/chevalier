import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ErpRoutingModule } from './erp-routing.module';
import { ErpComponent } from './erp.component';
import { TopbarComponent } from './layout/topbar/topbar.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { ServiceandcutsComponent } from './views/serviceandcuts/serviceandcuts.component';

import { FormsModule,ReactiveFormsModule  } from '@angular/forms';

import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { AddclientComponent } from './layout/addclient/addclient.component';
import { MatDialogModule } from '@angular/material/dialog'; 
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { ClientsService } from './service/clients/clients.service';
import { TokenInterceptorService } from './service/token-interceptor/token-interceptor.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SalesListComponent } from './views/sales-list/sales-list.component';
import { ReportsComponent } from './views/reports/reports.component'; 
import { MatCardModule } from '@angular/material/card';
import { PdfReportComponent } from './layout/pdf-report/pdf-report.component';  
import { DashboardComponent } from './views/dashboard/dashboard.component';

import { MatDividerModule } from '@angular/material/divider';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CustomChartComponent } from './layout/custom-chart/custom-chart.component'; 
 import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { NgApexchartsModule } from 'ng-apexcharts';
import { DiscountModalComponent } from './layout/discount-modal/discount-modal.component';
import { SearchAutocompleteComponent } from './layout/search-autocomplete/search-autocomplete.component'; 
import { ProductsAdminComponent } from './views/products-admin/products-admin.component';
import { ProductCreateModalComponent } from './layout/product-create-modal/product-create-modal.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MobileSidebarComponent } from './layout/mobile-sidebar/mobile-sidebar.component';
import { ProductInputComponent } from './views/product-input/product-input.component';
import { AddSupplierModalComponent } from './layout/add-supplier-modal/add-supplier-modal.component';
import { DynamicModalInputComponent } from './containers/dynamic-modal-input/dynamic-modal-input.component';
import { NewInputModalComponent } from './layout/new-input-modal/new-input-modal.component';
import { RelativeDatePipe } from './pipe/relative-date/relative-date.pipe';
import { EtiquetasCantidadDialogComponent } from './layout/etiquetas-cantidad-dialog/etiquetas-cantidad-dialog.component';
import { ProductOptionsModalComponent } from './containers/product-options-modal/product-options-modal.component';
 
import { MatTabsModule } from '@angular/material/tabs';
import { BarberSuppliesTrackerComponent } from './layout/barber-supplies-tracker/barber-supplies-tracker.component'; 
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AssignmentListComponent } from './views/assignment-list/assignment-list.component'; 

import { MatMenuModule } from '@angular/material/menu'; 
import { MatBadgeModule } from '@angular/material/badge'; 

@NgModule({
  declarations: [
    ErpComponent,
    TopbarComponent,
    SidebarComponent,
    ServiceandcutsComponent,
    AddclientComponent,
    SalesListComponent,
    ReportsComponent,
    PdfReportComponent,
    CustomChartComponent,
    DashboardComponent,
    DiscountModalComponent,
    SearchAutocompleteComponent, 
    ProductsAdminComponent, ProductCreateModalComponent, MobileSidebarComponent, ProductInputComponent, AddSupplierModalComponent, DynamicModalInputComponent, NewInputModalComponent, RelativeDatePipe, EtiquetasCantidadDialogComponent, ProductOptionsModalComponent, BarberSuppliesTrackerComponent, AssignmentListComponent 
  ],
  imports: [  

    CommonModule,
    ErpRoutingModule,
    FormsModule,
    ReactiveFormsModule ,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatOptionModule,
    MatDialogModule ,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatSnackBarModule, 
    MatPaginatorModule, 
    MatCardModule,  
    MatDividerModule,  
    NgApexchartsModule,
    MatSlideToggleModule, 
    MatCheckboxModule,
     MatTabsModule,
     MatProgressSpinnerModule, 

         MatMenuModule, 
    MatBadgeModule, 
    
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], 
  providers: [ClientsService, TokenInterceptorService,],
  exports: [
    CustomChartComponent, // Exporta este componente para que pueda usarse en otros módulos
  ],
})
export class ErpModule { }
