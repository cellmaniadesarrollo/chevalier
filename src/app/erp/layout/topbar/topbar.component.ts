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
  constructor(private sidebarService: SidebarService, private authservi: AuthService, private productservice: ProductsService) { }
  user: any;
  logout() {
    // Borrar la sesión
    this.authservi.logout()
    // Redireccionar al login

  }

  toggleSidebar() {
    this.sidebarService.toggleMinimized();  // Llamar al servicio para minimizar/maximizar la sidebar
  }
  notifications: any[] = [];

  ngOnInit(): void {
    // Intentar obtener el usuario de localStorage o sessionStorage
    const userData = localStorage.getItem('user') || sessionStorage.getItem('user');

    if (userData) {
      this.user = JSON.parse(userData);
    }
    console.log(this.user)
    if (this.user.username !== 'byronp') {
      this.getdata()     
 
    }
  }


  async getdata() {
    this.notifications = await this.productservice.listExpiredProducts() 
  }
  get expiredProducts() {
    const now = new Date();
    return this.notifications.filter(item => new Date(item.expirationDate) < now);
  }

  get nearExpiredProducts() {
    const now = new Date();
    const inSevenDays = new Date();
    inSevenDays.setDate(now.getDate() + 7);

    return this.notifications.filter(item => {
      const expDate = new Date(item.expirationDate);
      return expDate >= now && expDate <= inSevenDays;
    });
  }

  get totalAlerts(): number {
    return this.expiredProducts.length + this.nearExpiredProducts.length;
  }


  showDropdown = false;

  toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.showDropdown = !this.showDropdown;
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event) {
    this.showDropdown = false;
  }
}
