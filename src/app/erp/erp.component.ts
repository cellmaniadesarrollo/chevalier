import { Component, HostListener, OnInit } from '@angular/core';
import { SidebarService } from './service/sidebar/sidebar.service';

@Component({
  selector: 'app-erp',
  templateUrl: './erp.component.html',
  styleUrl: './erp.component.css'
})
export class ErpComponent {
  constructor(public sidebarService: SidebarService) {}
   isMobile = false;

  ngOnInit() {
    this.checkIfMobile();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkIfMobile();
  }

  checkIfMobile() {
    this.isMobile = window.innerWidth < 768; // Puedes ajustar el breakpoint
  }
}
