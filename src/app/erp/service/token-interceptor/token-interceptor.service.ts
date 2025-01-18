import { Injectable } from '@angular/core';
import axios, { InternalAxiosRequestConfig } from 'axios';
import { Router } from '@angular/router';
import { NotyfService } from '../notyf/notyf.service';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class TokenInterceptorService {

  constructor(private router: Router, private notyf: NotyfService) {
    // Interceptor de Axios para añadir el token en cada petición
    axios.interceptors.request.use(
      (config: InternalAxiosRequestConfig<any>) => {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (token) {
          config.headers.set('Authorization', `Bearer ${token}`);
        }
        config.timeout = 5000; // Añadir tiempo de espera de 5 segundos
        return config;
      },
      (error: any) => Promise.reject(error)
    );

    axios.interceptors.response.use(
      (response) => {
        // Mostrar notificación de éxito
        if (response.status === 200 || response.status === 201) {
          this.notyf.success('Operación exitosa');
        }
        return response;
      },
      async (error) => {
        if (error.response) {
          const statusCode = error.response.status;

          // Manejo de errores según código de estado
          switch (statusCode) {
            case 400:
              this.notyf.error('Error en los datos enviados');
              break;

            case 401:
              this.notyf.error('Sesión expirada, intentando refrescar el token...');
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              sessionStorage.removeItem('token');
              sessionStorage.removeItem('user');
              this.router.navigate(['/login']);
              // Intento de refrescar el token
              // try {
              //   const refreshToken = localStorage.getItem('refreshToken');
              //   if (refreshToken) {
              //     const newToken = await this.refreshToken(refreshToken);
              //     if (newToken) {
              //       localStorage.setItem('token', newToken);
              //       error.config.headers['Authorization'] = `Bearer ${newToken}`;
              //       return axios.request(error.config); // Reintentar la solicitud original con el nuevo token
              //     }
              //   }
              // } catch (refreshError) {
              //   this.notyf.error('No se pudo refrescar el token, por favor inicia sesión nuevamente');
              //   localStorage.removeItem('token');
              //   localStorage.removeItem('user');
              //   sessionStorage.removeItem('token');
              //   sessionStorage.removeItem('user');
              //   this.router.navigate(['/login']);
              // }
              break;

            case 403:
              this.notyf.error('No tienes permiso para realizar esta acción');
              break;

            case 404:
              this.notyf.error('Recurso no encontrado');
              break;

            case 500:
              this.notyf.error('Error del servidor, intenta más tarde');
              break;

            default:
              this.notyf.error('Ocurrió un error inesperado');
          }
        } else if (error.request) {
          this.notyf.error('No se recibió respuesta del servidor, verifica tu conexión');
        } else {
          this.notyf.error('Ocurrió un error inesperado');
        }

        return Promise.reject(error);
      }
    );
  }

  // Método para refrescar el token
  private async refreshToken(refreshToken: string): Promise<string | null> {
    try {
      const response = await axios.post(`${environment.apiUrl}/auth/refresh-token`, { token: refreshToken });
      return response.data.token; // Retorna el nuevo token
    } catch (error) {
      console.error('Error refrescando el token:', error);
      return null;
    }
  }
}
