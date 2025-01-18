import { CanActivateFn, Router  } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../../service/auth/auth.service';
export const authGuardrol: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);  // Inyectamos el servicio de autenticación
  const router = inject(Router);           // Inyectamos el router para redirigir si es necesario

  const allowedRoles = route.data?.['allowedRoles']; // Obtener los roles permitidos desde la ruta

  // Verificar si el usuario está autenticado y tiene alguno de los roles permitidos
  if (authService.isAuthenticated() && authService.hasRole(allowedRoles)) {
    return true;  // Permitir el acceso
  } else {
    // Redirigir al usuario si no tiene acceso
    router.navigate(['/unauthorized']);
    return false;
  }
};
