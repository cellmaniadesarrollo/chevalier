import { Component, HostListener } from '@angular/core';

import { SidebarService } from '../../service/sidebar/sidebar.service';
import { AuthService } from '../../../service/auth/auth.service';
import { ProductsService } from '../../service/products/products.service';
@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css'
})
export class TopbarComponent {
 user: any;
  notifications: any[] = [];
  showDropdown = false;

  constructor(
    private sidebarService: SidebarService,
    private authService: AuthService,
    private productService: ProductsService
  ) {}

  ngOnInit(): void {
    // Obtener usuario desde localStorage o sessionStorage
    const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
    }

    if (this.user?.username !== 'byronp') {
      this.loadNotifications();
    }
  }

  logout(): void {
    this.authService.logout();
  }

  toggleSidebar(): void {
    this.sidebarService.toggleMinimized();
  }

  async loadNotifications(): Promise<void> {
    const data = await this.productService.listExpiredProducts();

    const now = new Date();

    this.notifications = data.map((item: any) => {
      const expDate = new Date(item.expirationDate);
      return {
        ...item,
        status: expDate < now ? 'expired' : 'near' // expired=rojo, near=amarillo
      };
    });
  }

  get totalAlerts(): number {
    return this.notifications.length;
  }

  toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.showDropdown = !this.showDropdown;
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(): void {
    this.showDropdown = false;
  }
}
