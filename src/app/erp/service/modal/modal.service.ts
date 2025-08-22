import { Injectable } from '@angular/core';
import { DynamicModalInputComponent } from '../../containers/dynamic-modal-input/dynamic-modal-input.component';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { EtiquetasCantidadDialogComponent } from '../../layout/etiquetas-cantidad-dialog/etiquetas-cantidad-dialog.component';
import { ProductOptionsModalComponent } from '../../containers/product-options-modal/product-options-modal.component';
import { EditClientComponent } from '../../layout/edit-client/edit-client.component';

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
      maxHeight: '90vh',
      disableClose: true,
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
openCantidadDialog(initialValue: number = 1): Promise<number | undefined> {
  const dialogRef = this.dialog.open(EtiquetasCantidadDialogComponent, {
    width: '300px',
    data: { initialValue }
  });

  return dialogRef.afterClosed().toPromise();
}
 abrirModalConDatos(data: any) {
    this.dialog.open(ProductOptionsModalComponent, {
      width: '700px',
      data: data
    });
  }

   abrirModalEditarCliente(data: any) { 
  const dialogRef = this.dialog.open(EditClientComponent, {
    width: '700px',
    height: '450px',
    data: data
  });

  return dialogRef; 
}
}
