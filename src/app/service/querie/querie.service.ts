import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../../environments/environment';
  // Declara la variable global grecaptcha
  declare var grecaptcha: any;
@Injectable({
  providedIn: 'root'
})
export class QuerieService {
  private apiUrl = environment.apiUrl;
  url: string = `${this.apiUrl}/`
  private siteKey = '6Lf_C78qAAAAABW1udsb9PmInY4f5e1TBw5C5Z8Y'; // Reemplaza con tu clave de sitio

  constructor() {}

  // Obtener el token de reCAPTCHA
  async executeRecaptcha(action: string): Promise<string> {
    return new Promise((resolve, reject) => {
      grecaptcha.enterprise.ready(() => {
        grecaptcha.enterprise.execute(this.siteKey, {action: action})
          .then((token: string) => {
            resolve(token);
          })
          .catch((error: any) => {
            reject(error);
          });
      });
    });
  }

  // Enviar los datos al backend usando Axios
  async sendFeedback(data: any): Promise<any> { 
    try {
      const response = await axios.post(this.url + 'consulta-cortes', {cedula:data.cedula}, {
        headers: {
          'Content-Type': 'application/json',
          'recaptcha-token': data.token // Envía el token en los headers
        }
      }); 
      return response.data;
    } catch (error: any) { 
        throw error; 
    }
  }
}
