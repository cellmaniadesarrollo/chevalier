import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErpComponent } from './erp.component';
import { authGuard } from '../guards/auth.guard';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { ServiceandcutsComponent } from './views/serviceandcuts/serviceandcuts.component';
import { SalesListComponent } from './views/sales-list/sales-list.component';
import { authGuardrol } from './guards/auth/auth.guard';
import { ReportsComponent } from './views/reports/reports.component';
const routes: Routes = [{ path: '', component: ErpComponent,
  canActivate: [authGuard], // Proteger todas las rutas del ERP
  children: [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // Redirige a 'dashboard'
    { path: 'dashboard', component: DashboardComponent },
    { path: 'serviceandcuts', component: ServiceandcutsComponent },
    { path: 'saleslist', component: SalesListComponent },
    {
      path: 'reports',
      component: ReportsComponent ,
      canActivate: [authGuardrol],  // Utiliza el guard para proteger la ruta
      data: { allowedRoles: ['ADMIN', 'SUPERVISOR'] }  // Especifica los roles permitidos
    },
  ]
 }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ErpRoutingModule { }
