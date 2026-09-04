import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CashSessionService {
  private API_URL = environment.apiUrl + '/api/';

  private statusSubject = new BehaviorSubject<any>(null);
  status$ = this.statusSubject.asObservable();
  private sessionIssueSubject = new Subject<string>(); // emite el 'code'
  sessionIssue$ = this.sessionIssueSubject.asObservable();
  reportSessionIssue(code: string): void {
    this.sessionIssueSubject.next(code);
  }
  async refreshStatus(): Promise<void> {
    await this.getStatus();
  }
  async getStatus(): Promise<any> {
    try {
      const response = await axios.get(`${this.API_URL}cashsession/status`);
      this.statusSubject.next(response.data);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo estado de caja:', error);
      throw error;
    }
  }

  async open(data: any): Promise<any> {
    try {
      const response = await axios.post(`${this.API_URL}cashsession/open`, data);
      await this.getStatus(); // refresca el estado compartido
      return response.data;
    } catch (error) {
      console.error('Error abriendo caja:', error);
      throw error;
    }
  }

  async close(data: any): Promise<any> {
    try {
      const response = await axios.post(`${this.API_URL}cashsession/close`, data);
      await this.getStatus();
      return response.data;
    } catch (error) {
      console.error('Error cerrando caja:', error);
      throw error;
    }
  }
  async getOpeningPreview(): Promise<any> {
    try {
      const response = await axios.get(`${this.API_URL}cashsession/opening-preview`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo preview de apertura:', error);
      throw error;
    }
  }
  async createMovement(data: {
    session: string;
    type: 'income' | 'expense';
    amount: number;
    description: string;
    files?: File[];
  }): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('session', data.session);
      formData.append('type', data.type);
      formData.append('amount', data.amount.toString());
      formData.append('description', data.description);

      (data.files || []).forEach((file) => {
        formData.append('attachments', file);
      });

      const response = await axios.post(`${this.API_URL}cashmovement`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      await this.getStatus(); // refresca currentExpectedCash con el nuevo movimiento
      return response.data;
    } catch (error) {
      console.error('Error registrando movimiento de caja:', error);
      throw error;
    }
  }

  // 🔹 Opcional: listado de movimientos de la sesión (para historial)
  async getMovementsBySession(sessionId: string, page = 1, limit = 20): Promise<any> {
    try {
      const response = await axios.get(
        `${this.API_URL}cashmovement/session/${sessionId}`,
        { params: { page, limit } }
      );
      return response.data;
    } catch (error) {
      console.error('Error obteniendo movimientos de caja:', error);
      throw error;
    }
  }
  async listSessions(page = 1, limit = 20, status?: string): Promise<any> {
    try {
      const response = await axios.get(`${this.API_URL}cashsession/list`, {
        params: { page, limit, status },
      });
      return response.data;
    } catch (error) {
      console.error('Error listando sesiones de caja:', error);
      throw error;
    }
  }
  async getMovementDetail(movementId: string): Promise<any> {
    try {
      const response = await axios.get(`${this.API_URL}cashmovement/${movementId}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo detalle del movimiento:', error);
      throw error;
    }
  }
}
