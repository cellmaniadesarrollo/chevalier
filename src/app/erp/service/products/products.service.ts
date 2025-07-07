import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../../../environments/environment';
import { TokenInterceptorService } from '../token-interceptor/token-interceptor.service';
@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private API_URL = environment.apiUrl + '/api/'; // URL del backend
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
  async getnewdata(): Promise<any> {
    try {
      const response = await axios.get(`${this.API_URL}getnewdata`);
      return response.data;
    } catch (error) {
      console.error('Error saving client:', error);
      throw error;
    }
  }
  async saveproduct(data:any): Promise<any> {
    try {
      const response = await axios.post(`${this.API_URL}saveproduct`,data);
      return response.data;
    } catch (error) {
      console.error('Error saving client:', error);
      throw error;
    }
  }
  async lisproducts(data:any): Promise<any> {
    try {
      const response = await axios.post(`${this.API_URL}listproducts`,data);
      return response.data;
    } catch (error) {
      console.error('Error saving client:', error);
      throw error;
    }
  }

    async suppliersnewdata(): Promise<any> {
    try {
      const response = await axios.get(`${this.API_URL}getnewdatasupplier` );
      return response.data;
    } catch (error) {
      console.error('Error saving client:', error);
      throw error;
    }
  }
  async checkIdentificationExists(id:any): Promise<any> {
    try { 
      const response = await axios.post(`${this.API_URL}finddnisupplierexist`,id  );
      return  response
      } catch (error) {
      console.error('Error saving client:', error);
      throw error;
    }
  }
  async save(data: any): Promise<any> {
    try {
      const response = await axios.post(`${this.API_URL}savesupplier`, data);
      return response
    } catch (error) {
      console.error('Error saving client:', error);
      throw error;
    }
  }
      async getnewdataisert(): Promise<any> {
    try { 
      const response = await axios.get(`${this.API_URL}getnewdatainsert`   );
      return  response.data
      } catch (error) {
      console.error('Error saving client:', error);
      throw error;
    }
  }
  async findSupplier(supplierData: any): Promise<any> {
    try {
      const response = await axios.post(`${this.API_URL}findsuppliers`, supplierData);
      return response.data;
    } catch (error) {
      console.error('Error finding supplier:', error);
      throw error;
    }
  }
    async findProductsincome(productData: any): Promise<any> {
    try {
      console.log('Finding products with data:', productData);
      const response = await axios.post(`${this.API_URL}findproductincome`,productData);
      return response.data;
    } catch (error) {
      console.error('Error finding supplier:', error);
      throw error;
    }
  }
    async saveProductsIncome(data: any): Promise<any> {
    try {
      const response = await axios.post(`${this.API_URL}saveproductincome`, data);
      return response
    } catch (error) {
      console.error('Error saving client:', error);
      throw error;
    }
  }
      async listProductsIncome(data: any): Promise<any> {
    try {
      const response = await axios.post(`${this.API_URL}listproductincome`, data);
      return response.data
    } catch (error) {
      console.error('Error saving client:', error);
      throw error;
    }
  }
}
