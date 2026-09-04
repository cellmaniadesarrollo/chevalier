import { Injectable } from '@angular/core';
import axios, { InternalAxiosRequestConfig } from 'axios';
import { Router } from '@angular/router';
import { NotyfService } from '../notyf/notyf.service';
import { environment } from '../../../../environments/environment';
import { CashSessionService } from '../cash-session/cash-session.service'; // 🔹 nuevo

@Injectable({
  providedIn: 'root',
})
export class TokenInterceptorService {

  constructor(
    private router: Router,
    private notyf: NotyfService,
    private cashSessionService: CashSessionService // 🔹 nuevo
  ) {

    // Interceptor de Peticiones (Request)
    axios.interceptors.request.use(
      (config: InternalAxiosRequestConfig<any>) => {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');

        // No adjuntar token en login o refresh
        const isAuthRoute = config.url?.includes('/login') || config.url?.includes('/refresh-token');
        if (token && !isAuthRoute) {
          config.headers.set('Authorization', `Bearer ${token}`);
        }

        config.timeout = 25000;
        return config;
      },
      (error: any) => Promise.reject(error)
    );

    // Interceptor de Respuestas (Response)
    axios.interceptors.response.use(
      (response) => {
        // Cabecera opcional para omitir notificaciones globales en peticiones específicas
        const skipInterceptor = response.config.headers['X-Skip-Interceptor'] === 'true';

        // Solo mostrar éxito en operaciones de escritura (POST, PUT, DELETE, PATCH)
        // y omitir si se solicitó explícitamente o si es la ruta de login
        const method = response.config.method?.toUpperCase();
        const isLogin = response.config.url?.includes('/login');

        if (!skipInterceptor && !isLogin && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method || '')) {
          if (response.status === 200 || response.status === 201) {
            this.notyf.success('Operación exitosa');
          }
        }

        return response;
      },
      async (error) => {
        // Verificar si la petición solicitó omitir el manejo global de errores
        const skipInterceptor = error.config?.headers?.['X-Skip-Interceptor'] === 'true';

        if (skipInterceptor) {
          // Deja pasar el error directamente al catch() del servicio/componente
          return Promise.reject(error);
        }

        // 🔹 Casos de caja: se manejan aparte, sin toast genérico,
        // y avisan al topbar para que abra el modal solo.
        const errorCode = error.response?.data?.code;
        if (errorCode === 'CASH_SESSION_REQUIRED' || errorCode === 'CASH_SESSION_PENDING') {
          this.cashSessionService.reportSessionIssue(errorCode);
          return Promise.reject(error);
        }

        if (error.response) {
          const statusCode = error.response.status;
          const customMessage = error.response.data?.message;

          switch (statusCode) {
            case 400:
              this.notyf.error(customMessage || 'Datos inválidos');
              break;

            case 401:
              // Evita redireccionar si el error 401 proviene del mismo intento de login
              if (!error.config.url?.includes('/login')) {
                this.notyf.error('Sesión expirada');
                localStorage.clear();
                sessionStorage.clear();
                this.router.navigate(['/login']);
              } else {
                this.notyf.error(customMessage || 'Credenciales incorrectas');
              }
              break;

            case 403:
              this.notyf.error('No tienes permiso para realizar esta acción');
              break;

            case 404:
              this.notyf.error(customMessage || 'Recurso no encontrado');
              break;

            case 500:
              this.notyf.error('Error del servidor, intenta más tarde');
              console.error('Error del servidor:', error.response.data);
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

  private async refreshToken(refreshToken: string): Promise<string | null> {
    try {
      const response = await axios.post(`${environment.apiUrl}/auth/refresh-token`, { token: refreshToken });
      return response.data.token;
    } catch (error) {
      console.error('Error refrescando el token:', error);
      return null;
    }
  }
}