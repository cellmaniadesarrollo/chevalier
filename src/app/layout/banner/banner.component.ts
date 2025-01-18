import { Component, Input  } from '@angular/core';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.css'
})
export class BannerComponent {
  @Input() title!: string; // Título que vendrá del componente padre
  @Input() pageName!: string; // Página actual para la navegación
}
