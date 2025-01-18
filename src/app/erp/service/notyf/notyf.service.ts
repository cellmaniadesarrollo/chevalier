import { Injectable } from '@angular/core';  
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef } from '@angular/material/snack-bar';
import { SimpleSnackBar } from '@angular/material/snack-bar';
@Injectable({
  providedIn: 'root'
})
export class NotyfService {
  constructor(private snackBar: MatSnackBar) {}

  success(message: string) {
    this.showNotification(message, [  'success-snackbar', 'success-snackbar-icon' ]);
  }

  error(message: string) {
    this.showNotification(message, ['error-snackbar', 'error-snackbar-icon' ]);
  }

  private showNotification(message: string, panelClass: string[]) {
    const config: MatSnackBarConfig = {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass 
    };

    // Crear una nueva instancia de snackbar cada vez
    const snackBarRef: MatSnackBarRef<SimpleSnackBar> = this.snackBar.open(message, 'Cerrar', config);

    // Asegurarse de que cada notificación espere a que se cierre la anterior
    snackBarRef.afterDismissed().subscribe(() => {
      // Aquí podrías manejar acciones adicionales al cerrar cada notificación
    });
  }
}
