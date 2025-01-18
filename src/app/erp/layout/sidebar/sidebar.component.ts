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

  constructor(public sidebarService: SidebarService,public authService: AuthService) {}

  // Maximiza temporalmente al pasar el mouse
  onMouseEnter() {
    if (this.sidebarService.isMinimized()) {
      this.isHovered = true;
      this.sidebarService.setMinimized(false);  // Forzar maximización
    }
  }

  // Minimiza al salir del mouse
  onMouseLeave() {
    if (this.isHovered) {
      this.sidebarService.setMinimized(true);  // Minimizar al salir
      this.isHovered = false;
    }
  }
    // Puedes crear un método que verifique los roles si lo necesitas para reutilización
    isUserAdminOrSupervisor(): boolean {
      return this.authService.hasRole(['ADMIN', 'SUPERVISOR']);
    }
}
