import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../../../environments/environment';
import { TokenInterceptorService } from '../token-interceptor/token-interceptor.service';
 
@Injectable({
  providedIn: 'root'
})
export class SalesService {

  private API_URL = environment.apiUrl+'/api/'; // URL del backend
  constructor(private tokenInterceptor: TokenInterceptorService) { }



  async getNewSalesData(): Promise<any> {
    try {
      const response = await axios.get(`${this.API_URL}salesgetnewdata`);
      return response.data;
    } catch (error) {
      console.error('Error saving client:', error);
      throw error;
    }
  }
  async getSalesDiscount(data:any): Promise<any> {
    try {
      const response = await axios.post(`${this.API_URL}salesgetdiscount`,data);
      return response.data;
    } catch (error) {
      console.error('Error saving client:', error);
      throw error;
    }
  }


  //salesgetfinancialentitys
  async getSalesfinancialentitys(): Promise<any> {
    try {
      const response = await axios.get(`${this.API_URL}salesgetfinancialentitys`);
      return response.data;
    } catch (error) {
      console.error('Error saving client:', error);
      throw error;
    }
  }
  async Salessave(data:any): Promise<any> {
    try {
      const response = await axios.post(`${this.API_URL}salessave`,data);
      return response.data;
    } catch (error) {
      console.error('Error saving client:', error);
      throw error;
    }
  }
  async Saleslist(data:any): Promise<any> {
    try {
      const response = await axios.post(`${this.API_URL}saleslist`,data);
      return response.data;
    } catch (error) {
      console.error('Error saving client:', error);
      throw error;
    }
  }
  async Salesreports(data:any): Promise<any> {
    try {
      const response = await axios.post(`${this.API_URL}salesreport`,data);
      return response.data;
    } catch (error) {
      console.error('Error saving client:', error);
      throw error;
    }
  }
  async Salesreportsminimal(data:any): Promise<any> {
    try {
      const response = await axios.post(`${this.API_URL}salesreportminimal`,data);
      return response.data;
    } catch (error) {
      console.error('Error saving client:', error);
      throw error;
    }
  }
  async Salesreportsdetail(data:any): Promise<any> {
    try {
      const response = await axios.post(`${this.API_URL}salesreportpdfdetail`,data);
      return response.data;
    } catch (error) {
      console.error('Error saving client:', error);
      throw error;
    }
  }
  async Salesreportsmedium(data:any): Promise<any> {
    try {
      const response = await axios.post(`${this.API_URL}salesreportpdfmedium`,data);
      return response.data;
    } catch (error) {
      console.error('Error saving client:', error);
      throw error;
    }
  }



  async Salesgetdataprintticket(data:any): Promise<any> {
    try {
      const response = await axios.post(`${this.API_URL}salesprintticket`,data);
      return response.data;
    } catch (error) {
      console.error('Error saving client:', error);
      throw error;
    }
  }

  async Salesgetdatagraph(): Promise<any> {
    try {
      const response = await axios.post(`${this.API_URL}salesreportgrahp`);
      return response.data;
    } catch (error) {
      console.error('Error saving client:', error);
      throw error;
    }
  }






  async Salesprintticket(data: any): Promise<any> {
    const requests = [
      
      axios.post('https://192.168.31.240:3051/printticktets', data)
      //axios.post('https://localhost:3051/printticktets', data)
        .then(response => ({ status: 'fulfilled', data: response.data }))
        .catch(error => ({ status: 'rejected', reason: error })), 
      // axios.post('https://192.168.0.100:3051/printticktets', data)
      //   .then(response => ({ status: 'fulfilled', data: response.data }))
      //   .catch(error => ({ status: 'rejected', reason: error }))
    ];
  
    try {
      const result = await Promise.race(requests);
  
      if (result.status === 'fulfilled') {
        console.log(`Successful request to one of the servers`);
        return result ;
      } else {
        throw result ;
      }
    } catch (error) {
      console.error('All requests failed or the first response was an error:', error);
      throw error;
    }
  }
 
  // async Salesprintticket(data:any): Promise<any> {
  //   try { 
     
  //      const response = await axios.post(`https://192.168.31.240:3051/printticktets`,data);
  //     return response.data;
  //   } catch (error) {
  //     console.error('Error saving client:', error);
  //     throw error;
  //   }
  // }
}
