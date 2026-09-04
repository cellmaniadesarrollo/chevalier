import { Component } from '@angular/core';
import { SidebarService } from '../../service/sidebar/sidebar.service';
import { AuthService } from '../../../service/auth/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  isHovered = false;
  userName = JSON.parse(localStorage.getItem('user') || '{}').username || 'Usuario';
  userImage = 'img/userdefault.png';

  constructor(public sidebarService: SidebarService, public authService: AuthService) { }

  onMouseEnter() {
    if (this.sidebarService.isMinimized()) {
      this.isHovered = true;
      this.sidebarService.setMinimized(false);
    }
  }

  onMouseLeave() {
    if (this.isHovered) {
      this.sidebarService.setMinimized(true);
      this.isHovered = false;
    }
  }

  isUserAdminOrSupervisor(): boolean {
    return this.authService.hasRole(['ADMIN', 'SUPERVISOR']);
  }

  // 🔹 nuevo: true si el usuario ES barbero y NO tiene ningún otro rol con más acceso.
  // Así, si alguien es HAIRDRESSER + CASHIER (por ejemplo), sigue viendo el menú completo.
  isOnlyHairdresser(): boolean {
    const isHairdresser = this.authService.hasRole(['HAIRDRESSER']);
    const hasOtherAccessRole = this.authService.hasRole(['ADMIN', 'SUPERVISOR', 'CASHIER', 'MANAGER']);
    return isHairdresser && !hasOtherAccessRole;
  }

  isProductsOpen = false;
  toggleProducts() {
    this.isProductsOpen = !this.isProductsOpen;
  }

  isCashOpen = false;
  toggleCash() {
    this.isCashOpen = !this.isCashOpen;
  }
}