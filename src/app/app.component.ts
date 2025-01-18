import { Component } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'web-chevalier';
  showNavAndFooter = false; // Variable para controlar la visibilidad de navbar y footer

  constructor(private router: Router, private route: ActivatedRoute) {
    // Detecta los cambios de ruta
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd) // Filtramos para solo escuchar cuando la navegación termina
    ).subscribe((event: NavigationEnd) => {
      // Ocultamos navbar y footer cuando la ruta contiene '/erp'
      this.showNavAndFooter = !event.url.includes('/erp');
    });
  }
  
}
