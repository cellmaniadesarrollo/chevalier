import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../../../environments/environment';
import { TokenInterceptorService } from '../token-interceptor/token-interceptor.service';
environment
@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  private API_URL = environment.apiUrl+'/api/'; // URL del backend
  constructor(private tokenInterceptor: TokenInterceptorService) { }

   // Método para enviar los datos del cliente al backend
   async saveClient(clientData: any): Promise<any> {
    try {
      const response = await axios.post(`${this.API_URL}saveclients`, clientData);
      return response.data;
    } catch (error) {
      console.error('Error saving client:', error);
      throw error;
    }
  }
   // Método para enviar los datos del cliente al backend
   async findClient(clientData: any): Promise<any> {
    try {
      const response = await axios.post(`${this.API_URL}findclients`, clientData);
      return response.data;
    } catch (error) {
      console.error('Error saving client:', error);
      throw error;
    }
  }
}
