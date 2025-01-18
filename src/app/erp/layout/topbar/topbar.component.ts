import { Component } from '@angular/core';

import { SidebarService } from '../../service/sidebar/sidebar.service';
import { AuthService } from '../../../service/auth/auth.service'; 
@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css'
})
export class TopbarComponent {
  constructor( private sidebarService: SidebarService,private authservi:AuthService) {}

  logout() {
    // Borrar la sesión
    this.authservi.logout() 
    // Redireccionar al login
   
  }

  toggleSidebar() {
    this.sidebarService.toggleMinimized();  // Llamar al servicio para minimizar/maximizar la sidebar
  }
 
}
