import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../../../environments/environment';
import { TokenInterceptorService } from '../token-interceptor/token-interceptor.service';

@Injectable({
  providedIn: 'root'
})
export class DiscountsService {
  private API_URL = environment.apiUrl + '/api/'; // URL del backend
  constructor(private tokenInterceptor: TokenInterceptorService) { }


  async lisdiscounts(page: number, limit: number, search: string) {
    try {
      const response = await axios.post(`${this.API_URL}listdiscounts`, {
        page,
        limit,
        search
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      throw error;
    }
  }

  async findOneDiscount(data:any){
        try {
      const response = await axios.post(`${this.API_URL}findonediscounts`, data);
      return response.data;
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      throw error;
    }
  }
    async getNewDataDicoounts() {
    try {
      const response = await axios.get(`${this.API_URL}getnewdatadiscounts` );
      return response.data;
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      throw error;
    }
  }
    async editOneDiscount(data:any){
        try {
      const response = await axios.post(`${this.API_URL}editonediscounts`, data);
      return response.data;
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      throw error;
    }
  }
      async saveOneDiscount(data:any){
        try {
      const response = await axios.post(`${this.API_URL}saveonediscounts`, data);
      return response.data;
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      throw error;
    }
  }
}
