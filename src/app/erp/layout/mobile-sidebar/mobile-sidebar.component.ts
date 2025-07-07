import { Component } from '@angular/core';
import { SidebarService } from '../../service/sidebar/sidebar.service';
import { AuthService } from '../../../service/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mobile-sidebar',
  templateUrl: './mobile-sidebar.component.html',
  styleUrl: './mobile-sidebar.component.css'
})
export class MobileSidebarComponent {
 isProductsOpen = false;
  userName = JSON.parse(localStorage.getItem('user') || '{}').username || 'Usuario';
  userImage = 'img/userdefault.png';

  constructor(
    public sidebarService: SidebarService,
    public authService: AuthService,
    private router: Router
  ) {}
 
  isUserAdminOrSupervisor(): boolean {
    return this.authService.hasRole(['ADMIN', 'SUPERVISOR']);
  }

  toggleProducts() {
    this.isProductsOpen = !this.isProductsOpen;
  }

 

  navigateTo(route: string) {
    this.router.navigate([route]);
    this.sidebarService.toggleMinimized()
  }
}
