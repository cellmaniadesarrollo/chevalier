import { Component } from '@angular/core';
import { SidebarService } from './service/sidebar/sidebar.service';
@Component({
  selector: 'app-erp',
  templateUrl: './erp.component.html',
  styleUrl: './erp.component.css'
})
export class ErpComponent {
  constructor(public sidebarService: SidebarService) {}
}
