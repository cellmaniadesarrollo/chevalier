import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../../../environments/environment';
import { TokenInterceptorService } from '../token-interceptor/token-interceptor.service';
@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private API_URL = environment.apiUrl+'/api/'; // URL del backend
  constructor(private tokenInterceptor: TokenInterceptorService) { }



  async findProduct(productData: any): Promise<any> {
    try {
      const response = await axios.post(`${this.API_URL}findproducts`, productData);
      return response.data;
    } catch (error) {
      console.error('Error saving client:', error);
      throw error;
    }
  }
}
