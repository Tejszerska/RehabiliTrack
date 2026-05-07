import { API_BASE_URL } from './config';
import type { Patient, CreatePatientRequest, UpdatePatientRequest } from '../types/models';

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  /**
   * Generyczny request handler
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    // Create a Headers instance when available (covers Headers | string[][] | Record).
    // If a Headers constructor isn't present in the runtime/types, fall back to
    // a plain object merge so `fetch` still receives headers in an acceptable shape.
    const HeadersCtor = (globalThis as any).Headers;
    let headers: any;
    if (HeadersCtor) {
      headers = new HeadersCtor(options.headers as any);
      if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
      }
    } else {
      headers = {
        'Content-Type': 'application/json',
        ...(options.headers as any),
      };
    }

 try {
      console.log(`API Request: ${options.method || 'GET'} ${url}`);

      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Sprawdzenie statusu
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP ${response.status}: ${errorText || response.statusText}`
        );
      }

      // Jeśli 204 No Content - nie parsuj JSON
      if (response.status === 204) {
        return {} as T;
      }

      const data = await response.json();
      console.log(`API Response:`, data);
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // === PATIENTS ===

  async getPatients(): Promise<Patient[]> {
    return this.request<Patient[]>('/Patients');
  }

  async getPatient(id: number): Promise<Patient> {
    return this.request<Patient>(`/Patients/${id}`);
  }

async createPatient(
  data: CreatePatientRequest)
  : Promise<{ id: number }> {
  return this.request<{ id: number }>('/Patients', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

async updatePatient(id: number, data: UpdatePatientRequest): Promise<void> {
  return this.request<void>(`/Patients/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ ...data, id: id }), 
  });
}

  async deletePatient(id: number): Promise<void> {
    return this.request<void>(`/Patients/${id}`, {
      method: 'DELETE',
    });
  }

  // === STAYS ===

}
// Singleton
export default new ApiService(); 