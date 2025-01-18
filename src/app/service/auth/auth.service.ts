import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import axios from 'axios';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userRoles: string[] = []; // Guardamos los roles del usuario logueado
  private API_URL = environment.apiUrl+'/api/'; // URL del backend

  constructor(private router: Router) {}

  // Método de login
  async login(data:any) { 
    try {
      
      const response = await axios.post(`${this.API_URL}login`,data);
 
      const { accessToken, user } = response.data;

      // Guardar el token en el localStorage o sessionStorage
      if (data.rememberMe) {
        localStorage.setItem('token', accessToken); // Token persistente
        localStorage.setItem('user', JSON.stringify(user)); // Datos del usuario persistentes
      } else {
        sessionStorage.setItem('token', accessToken); // Token temporal
        sessionStorage.setItem('user', JSON.stringify(user)); // Datos del usuario temporales
      }
      // Establecer roles desde user.roles
      this.setRoles(user.roles);
      return user; // Retornar los datos del usuario
    } catch (error) {
      throw new Error('Login failed: ' + error);
    }
  }

  // Método de logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    this.router.navigate(['/login']);
  }



  // Comprobar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token') || !!sessionStorage.getItem('token');
  }


   // Establecer roles desde los datos del usuario
   setRoles(roles: string[]) {
    this.userRoles = roles;
  }

  // Obtener los roles del usuario
  getRoles(): string[] {
    if (!this.userRoles.length) {
      const user = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (user) {
        this.userRoles = JSON.parse(user).roles;
      }
    }
    return this.userRoles;
  }

// Método para verificar si el usuario tiene uno de los roles permitidos
hasRole(allowedRoles: string[]): boolean {
  const user = this.getCurrentUser(); // Obtener el usuario actual desde el almacenamiento
  if (!user || !user.roles) {
    return false; // Si no hay usuario o no tiene roles, no tiene acceso
  }
  // Comprobar si alguno de los roles del usuario coincide con los roles permitidos
  return user.roles.some((role: string) => allowedRoles.includes(role));
}
  // Obtener el usuario actual (desde localStorage o sessionStorage)
  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}');
  }
}
