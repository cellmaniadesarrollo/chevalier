import { Component } from '@angular/core';
import { AuthService } from '../../../service/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  constructor(private authService: AuthService) { }

  ngOnInit(): void { }

  isAdminOrSupervisor(): boolean {
    return this.authService.hasRole(['ADMIN', 'SUPERVISOR']);
  }
  isCashierOrAdmin(): boolean {
    return this.authService.hasRole(['CASHIER', 'ADMIN']);
  }
  isHairdresser(): boolean {
    return this.authService.hasRole(['HAIRDRESSER']);
  }
  hasAnyDashboardAccess(): boolean {
    return this.isAdminOrSupervisor() || this.isCashierOrAdmin() || this.isHairdresser();
  }
}