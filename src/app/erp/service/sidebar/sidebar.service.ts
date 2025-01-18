import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private minimized = false; // Estado inicial de la sidebar

  // Método para obtener el estado
  isMinimized(): boolean {
    return this.minimized;
  }

  // Método para cambiar el estado
  toggleMinimized() {
    this.minimized = !this.minimized;
  }

  // Método para establecer el estado directamente
  setMinimized(minimized: boolean) {
    this.minimized = minimized;
  }
}
