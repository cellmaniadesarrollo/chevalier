import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core'; // Para inyectar dependencias
import { Router } from '@angular/router';
export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router); // Inyectamos el Router

  // Verificamos si el token existe en sessionStorage o localStorage
  const token = sessionStorage.getItem('token') || localStorage.getItem('token');

  if (token) {
    return true; // Permitir el acceso
  } else {
    // Si no hay token, redirigimos al login
    router.navigate(['/login']);
    return false;
  }
};
