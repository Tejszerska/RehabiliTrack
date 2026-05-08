export interface BaseEntity {
  id: number;
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
}

// PATIENTS

export interface Patient extends BaseEntity {
  firstName: string;
  lastName: string;
  pesel: string;
  phoneNumber?: string;
  notes?: string;
  stays: PatientStay[];
}

export interface PatientStay {
  stayId: number;
  stayName: string;
  startDate: string;
  endDate: string;
}

export interface CreatePatientRequest {
  firstName: string;
  lastName: string;
  pesel: string;
  phoneNumber?: string;
  notes?: string;
}

export interface UpdatePatientRequest extends CreatePatientRequest {
  id: number;
}

// THERAPISTS

export interface Therapist extends BaseEntity {
  firstName: string;
  lastName: string;
  licenseNumber: string; // PWZ
  phoneNumber?: string;
  notes?: string;
  therapistRoleId: number;
  therapistRoleName: string;
}

export interface CreateTherapistRequest {
  firstName: string;
  lastName: string;
  licenseNumber: string; 
  phoneNumber?: string;
  notes?: string;
  therapistRoleId: number;
}

export interface UpdateTherapistRequest extends CreateTherapistRequest {
  id: number;
}

// THERAPIST ROLES

export interface TherapistRole {
  id: number;
  name: string;
}

export interface CreateTherapistRoleRequest {
  name: string;
}

export interface UpdateTherapistRoleRequest extends CreateTherapistRoleRequest {
  id: number;
}

// ROOM TYPES

export interface RoomType {
  id: number;
  name: string;
}

export interface CreateRoomTypeRequest {
  name: string;
}

export interface UpdateRoomTypeRequest extends CreateRoomTypeRequest {
  id: number;
}

// REHAB ROOMS

export interface RehabRoom {
  id: number;
  roomNumber: string;
  name: string;
  capacity: number;
  roomTypeId: number;
  roomTypeName: string;
}

export interface CreateRehabRoomRequest {
  roomNumber: string;
  name: string;
  capacity: number;
  roomTypeId: number;
}

export interface UpdateRehabRoomRequest extends CreateRehabRoomRequest {
  id: number;
}

// TREATMENTS

export interface Treatment {
  id: number;
  name: string;
  durationMinutes: number;
}

export interface CreateTreatmentRequest {
  name: string;
  durationMinutes: number;
}

export interface UpdateTreatmentRequest extends CreateTreatmentRequest {
  id: number;
}

// STAYS

export interface Stay {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  occupancy: number;
  maxCapacity: number;
}

export interface StayPatient {
  stayParticipationId: number;
  patientId: number;
  patientFullName: string;
}

export interface StayDetails extends Stay {
  patients: StayPatient[];
}

export interface CreateStayRequest {
  name: string;
  startDate: string;
  endDate: string;
  maxCapacity: number;
}

export interface UpdateStayRequest extends CreateStayRequest {
  id: number;
}

// APPOINTMENTS

export enum AppointmentStatus {
  Scheduled = 'Scheduled',
  Completed = 'Completed',
  Canceled = 'Canceled'
}

export interface AppointmentListItem {
  id: number;
  patientId: number;
  patientFullName: string;
  treatmentId: number;
  treatmentName: string;
  therapistId: number;
  therapistFullName: string;
  roomId: number;
  roomName: string;
  startDateTime: string;
  status: string;
  outpatient: boolean;
}

export interface AppointmentDetails {
  id: number;
  patientId: number;
  patientFullName: string;
  patientNotes?: string;
  patientPhoneNumber?: string;
  
  treatmentId: number;
  treatmentName: string;
  treatmentDurationMinutes: string;
  
  therapistId: number;
  therapistFullName: string;
  therapistRoleId: number;
  therapistRoleName: string;
  
  roomId: number;
  roomName: string;
  roomNumber: string;
  roomTypeId: number;
  roomTypeName: string;
  
  startDateTime: string;
  status: string;
  
  stayParticipationId?: number;
  stayName: string;
  stayId: number;
}

export interface CreateAppointmentRequest {
  patientId: number;
  treatmentId: number;
  therapistId: number;
  roomId: number;
  startDateTime: string;
  status: AppointmentStatus;
  stayParticipationId?: number; 
}

export interface UpdateAppointmentRequest {
  id: number;
  patientId: number;
  treatmentId: number;
  therapistId: number;
  roomId: number;
  startDateTime: string;
  stayParticipationId?: number;
}