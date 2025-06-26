import { Injectable } from '@angular/core';
import { DynamicModalInputComponent } from '../../containers/dynamic-modal-input/dynamic-modal-input.component';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
   private currentView = new BehaviorSubject<string>('default');
  currentView$ = this.currentView.asObservable();

  constructor(private dialog: MatDialog) {}

  // Cambiar la vista actual del modal
  changeView(viewName: string) {
    this.currentView.next(viewName);
  }

  openIngresoModal(data?: any) {
    // Resetear a la vista por defecto al abrir
    this.currentView.next('ingreso');
    
    return this.dialog.open(DynamicModalInputComponent, {
      width: '800px',
      data: {
        contentType: 'ingreso',
        initialData: data,
        modalService: this // Pasamos referencia al servicio
      }
    });
  }

  openProveedorModal(data?: any) {
    // Resetear a la vista por defecto al abrir
    this.currentView.next('proveedor');
    
    return this.dialog.open(DynamicModalInputComponent, {
      width: '800px',
      data: {
        contentType: 'proveedor',
        initialData: data,
        modalService: this // Pasamos referencia al servicio
      }
    });
  }
}
