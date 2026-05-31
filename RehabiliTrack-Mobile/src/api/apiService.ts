import { API_BASE_URL } from './config';
import type {
  PatientDetails, CreatePatientRequest, UpdatePatientRequest,
  Therapist, CreateTherapistRequest, UpdateTherapistRequest,
  RehabRoom, CreateRehabRoomRequest, UpdateRehabRoomRequest,
  RoomType, CreateRoomTypeRequest, UpdateRoomTypeRequest,
  TherapistRole, CreateTherapistRoleRequest, UpdateTherapistRoleRequest,
  Treatment, CreateTreatmentRequest, UpdateTreatmentRequest,
  StayListItem, CreateStayRequest, UpdateStayRequest,
  CreateAppointmentRequest, UpdateAppointmentRequest,
  AppointmentListItem,
  AppointmentDetails,
  PatientListItem,
  StayDetails
} from '../types/models';
import EncryptedStorage from 'react-native-encrypted-storage';

class ApiService {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  //  AUTH CONTEXT
  public setAuthToken(token: string | null) {
    this.token = token;
  }

  /**
   * Generyczny request handler
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    // === get token ===
    const secureToken = await EncryptedStorage.getItem("auth_token");

    const HeadersCtor = (globalThis as any).Headers;
    let headers: any;
    if (HeadersCtor) {
      headers = new HeadersCtor(options.headers as any);
      if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
      }
      // use token
      if (secureToken) {
        headers.set('Authorization', `Bearer ${secureToken}`);
      }
    } else {
      headers = {
        'Content-Type': 'application/json',
        ...(options.headers as any),
      };
      // use token
      if (secureToken) {
        headers['Authorization'] = `Bearer ${secureToken}`;
      }
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // check status
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

  // === AUTH ===
  async login(username: string, password: string): Promise<{ token: string }> {
    return this.request<{ token: string }>('/Auth/Login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  // === PATIENTS ===
  async getPatients(): Promise<PatientListItem[]> {
    return this.request<PatientDetails[]>('/Patients');
  }

  async getPatient(id: number): Promise<PatientDetails> {
    return this.request<PatientDetails>(`/Patients/${id}`);
  }

  async createPatient(data: CreatePatientRequest): Promise<{ id: number }> {
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

  async searchPatients(term: string): Promise<PatientListItem[]> {
    return this.request<PatientListItem[]>(`/Patients/search?term=${encodeURIComponent(term)}`);
  }

  // === THERAPISTS ===
  async getTherapists(): Promise<Therapist[]> {
    return this.request<Therapist[]>('/Therapists');
  }

  async getTherapist(id: number): Promise<Therapist> {
    return this.request<Therapist>(`/Therapists/${id}`);
  }

  async createTherapist(data: CreateTherapistRequest): Promise<{ id: number }> {
    return this.request<{ id: number }>('/Therapists', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTherapist(id: number, data: UpdateTherapistRequest): Promise<void> {
    return this.request<void>(`/Therapists/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...data, id: id }),
    });
  }

  async deleteTherapist(id: number): Promise<void> {
    return this.request<void>(`/Therapists/${id}`, {
      method: 'DELETE',
    });
  }

  // === REHAB ROOMS ===
  async getRehabRooms(): Promise<RehabRoom[]> {
    return this.request<RehabRoom[]>('/RehabRooms');
  }

  async getRehabRoom(id: number): Promise<RehabRoom> {
    return this.request<RehabRoom>(`/RehabRooms/${id}`);
  }

  async createRehabRoom(data: CreateRehabRoomRequest): Promise<{ id: number }> {
    return this.request<{ id: number }>('/RehabRooms', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateRehabRoom(id: number, data: UpdateRehabRoomRequest): Promise<void> {
    return this.request<void>(`/RehabRooms/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...data, id: id }),
    });
  }

  async deleteRehabRoom(id: number): Promise<void> {
    return this.request<void>(`/RehabRooms/${id}`, {
      method: 'DELETE',
    });
  }

  // === ROOM TYPES ===
  async getRoomTypes(): Promise<RoomType[]> {
    return this.request<RoomType[]>('/RoomTypes');
  }

  async getRoomType(id: number): Promise<RoomType> {
    return this.request<RoomType>(`/RoomTypes/${id}`);
  }

  async createRoomType(data: CreateRoomTypeRequest): Promise<{ id: number }> {
    return this.request<{ id: number }>('/RoomTypes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateRoomType(id: number, data: UpdateRoomTypeRequest): Promise<void> {
    return this.request<void>(`/RoomTypes/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...data, id: id }),
    });
  }

  async deleteRoomType(id: number): Promise<void> {
    return this.request<void>(`/RoomTypes/${id}`, {
      method: 'DELETE',
    });
  }

  // === THERAPIST ROLES ===
  async getTherapistRoles(): Promise<TherapistRole[]> {
    return this.request<TherapistRole[]>('/TherapistRoles');
  }

  async getTherapistRole(id: number): Promise<TherapistRole> {
    return this.request<TherapistRole>(`/TherapistRoles/${id}`);
  }

  async createTherapistRole(data: CreateTherapistRoleRequest): Promise<{ id: number }> {
    return this.request<{ id: number }>('/TherapistRoles', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTherapistRole(id: number, data: UpdateTherapistRoleRequest): Promise<void> {
    return this.request<void>(`/TherapistRoles/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...data, id: id }),
    });
  }

  async deleteTherapistRole(id: number): Promise<void> {
    return this.request<void>(`/TherapistRoles/${id}`, {
      method: 'DELETE',
    });
  }

  // === TREATMENTS ===
  async getTreatments(): Promise<Treatment[]> {
    return this.request<Treatment[]>('/Treatments');
  }

  async getTreatment(id: number): Promise<Treatment> {
    return this.request<Treatment>(`/Treatments/${id}`);
  }

  async createTreatment(data: CreateTreatmentRequest): Promise<{ id: number }> {
    return this.request<{ id: number }>('/Treatments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTreatment(id: number, data: UpdateTreatmentRequest): Promise<void> {
    return this.request<void>(`/Treatments/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...data, id: id }),
    });
  }

  async deleteTreatment(id: number): Promise<void> {
    return this.request<void>(`/Treatments/${id}`, {
      method: 'DELETE',
    });
  }

  // === STAYS ===
  async getStays(): Promise<StayListItem[]> {
    return this.request<StayListItem[]>('/Stays');
  }
  async getCurrentStays(): Promise<StayListItem[]> {
    return this.request<StayListItem[]>('/Stays/Current');
  }

  async getStay(id: number): Promise<StayDetails> {
    return this.request<StayDetails>(`/Stays/${id}`);
  }

  async createStay(data: CreateStayRequest): Promise<{ id: number }> {
    return this.request<{ id: number }>('/Stays', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateStay(id: number, data: UpdateStayRequest): Promise<void> {
    return this.request<void>(`/Stays/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...data, id: id }),
    });
  }

  async deleteStay(id: number): Promise<void> {
    return this.request<void>(`/Stays/${id}`, {
      method: 'DELETE',
    });
  }

  // === APPOINTMENTS ===
  async getAppointments(stayIds?: number[]): Promise<AppointmentListItem[]> {
    if (!stayIds || stayIds.length === 0) {
      return this.request<AppointmentListItem[]>(`/Appointments/`);
    }

    const queryString = stayIds.map(id => `stayIds=${id}`).join('&');
    return this.request<AppointmentListItem[]>(`/Appointments?${queryString}`);
  }

  async getAppointment(id: number): Promise<AppointmentDetails> {
    return this.request<AppointmentDetails>(`/Appointments/${id}`);
  }

  async createAppointment(data: CreateAppointmentRequest): Promise<{ id: number }> {
    return this.request<{ id: number }>('/Appointments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAppointment(id: number, data: UpdateAppointmentRequest): Promise<void> {
    return this.request<void>(`/Appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...data, id: id }),
    });
  }

  async deleteAppointment(id: number): Promise<void> {
    return this.request<void>(`/Appointments/${id}`, {
      method: 'DELETE',
    });
  }

  // StayParticipation (tabela łącząca relacji M:M PAtients - Stays)

  // assign Patient To Stay
  async addPatientToStay(stayId: number, patientId: number): Promise<{ id: number }> {
    return this.request<{ id: number }>('/StayParticipations', {
      method: 'POST',
      body: JSON.stringify({ patientId, stayId }),
    });
  }

  // remove patient from stay
  async removePatientFromStay(stayParticipationId: number): Promise<void> {
    return this.request<void>(`/StayParticipations/${stayParticipationId}`, {
      method: 'DELETE',
    });
  }

}

// Singleton
export default new ApiService();