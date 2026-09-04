import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  private API_URL = environment.apiUrl + '/api/';

  // 🔹 Listado genérico de usuarios
  async list(params: { page?: number; limit?: number; search?: string; status?: string; role?: string } = {}): Promise<any> {
    try {
      const response = await axios.get(`${this.API_URL}user`, { params });
      return response.data;
    } catch (error) {
      console.error('Error listando usuarios:', error);
      throw error;
    }
  }

  // 🔹 Listado de barberos (activos/eliminados/todos + búsqueda por nombre o dni)
  async listBarbers(params: { page?: number; limit?: number; search?: string; status?: string } = {}): Promise<any> {
    try {
      const response = await axios.get(`${this.API_URL}user/barbers`, { params });
      return response.data;
    } catch (error) {
      console.error('Error listando barberos:', error);
      throw error;
    }
  }

  async getById(userId: string): Promise<any> {
    try {
      const response = await axios.get(`${this.API_URL}user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      throw error;
    }
  }

  async update(userId: string, data: any): Promise<any> {
    try {
      const response = await axios.put(`${this.API_URL}user/${userId}`, data);
      return response.data;
    } catch (error) {
      console.error('Error editando usuario:', error);
      throw error;
    }
  }

  // 🔹 Soft delete
  async softDelete(userId: string): Promise<any> {
    try {
      const response = await axios.delete(`${this.API_URL}user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      throw error;
    }
  }

  async restore(userId: string): Promise<any> {
    try {
      const response = await axios.patch(`${this.API_URL}user/${userId}/restore`, {});
      return response.data;
    } catch (error) {
      console.error('Error reactivando usuario:', error);
      throw error;
    }
  }

  // 🔹 Datos iniciales para formularios de usuario (roles, etc.)
  async getInitialData(): Promise<any> {
    try {
      const response = await axios.get(`${this.API_URL}initialdata/users`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo datos iniciales de usuario:', error);
      throw error;
    }
  }

  // 🔹 Comisiones por usuario/servicio
  async listCommissionsByUser(userId: string): Promise<any> {
    try {
      const response = await axios.get(`${this.API_URL}usercommission/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo comisiones del usuario:', error);
      throw error;
    }
  }

  async createCommission(data: { user: string; service: string; servicePrice?: number | null; rate: number }): Promise<any> {
    try {
      const response = await axios.post(`${this.API_URL}usercommission`, data);
      return response.data;
    } catch (error) {
      console.error('Error creando comisión:', error);
      throw error;
    }
  }

  async updateCommission(commissionId: string, data: { servicePrice?: number | null; rate?: number }): Promise<any> {
    try {
      const response = await axios.put(`${this.API_URL}usercommission/${commissionId}`, data);
      return response.data;
    } catch (error) {
      console.error('Error editando comisión:', error);
      throw error;
    }
  }

  async removeCommission(commissionId: string): Promise<any> {
    try {
      const response = await axios.delete(`${this.API_URL}usercommission/${commissionId}`);
      return response.data;
    } catch (error) {
      console.error('Error eliminando comisión:', error);
      throw error;
    }
  }

  // 🔹 Listado simple de servicios/productos disponibles (para asignar comisiones)
  async listServicesSimple(): Promise<any> {
    try {
      const response = await axios.get(`${this.API_URL}productservice/simple`);
      return response.data;
    } catch (error) {
      console.error('Error listando servicios:', error);
      throw error;
    }
  }
  async create(data: any): Promise<any> {
    try {
      const response = await axios.post(`${this.API_URL}user`, data);
      return response.data;
    } catch (error) {
      console.error('Error creando usuario:', error);
      throw error;
    }
  }
}