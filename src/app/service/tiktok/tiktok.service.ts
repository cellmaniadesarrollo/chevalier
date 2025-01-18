import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import axios from 'axios';
import { AxiosInstance } from 'axios';
import { ErrorResponse } from '../../models/error.interface';
@Injectable({
  providedIn: 'root'
})
export class TiktokService {
  private apiUrl = environment.apiUrl;
url: string = `${this.apiUrl}/`
private axiosClient1: AxiosInstance;
constructor(){
  this.axiosClient1 = axios.create({
    timeout: 20000,
    headers: {},
  });
}
private normalizeError(error: any): ErrorResponse {
 
  return {
    id: '-1',
    code: error.response.status,
    message: error.response.statusText,
  };
}
 
public async gevideos(): Promise<any> {
  try { 
    var axiosResponse = await this.axiosClient1.request({
      method: 'get',
      url: this.url + 'datavideos',
    
    }); 
    return axiosResponse.data;
  } catch (error) {
    return Promise.reject(this.normalizeError(error)); 
  }
}
 
}