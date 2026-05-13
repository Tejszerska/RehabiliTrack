export interface BaseEntity {
  id: number;
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
}

// PATIENTS

export interface PatientListItem extends BaseEntity {
  firstName: string;
  lastName: string;
  pesel: string;
  phoneNumber?: string;
  notes?: string;
}

export interface PatientDetails extends BaseEntity {
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

export interface StayListItem {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  occupancy: number;
  maxCapacity: number;
}

export interface StayDetailsPatient {
  id: number;
  fullName: string;
}

export interface StayDetailsParticipation {
  id: number; // participationId
  patient: StayDetailsPatient;
}

export interface StayDetails {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  occupancy: number;
  maxCapacity: number;
  participations: StayDetailsParticipation[];
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
  Scheduled = 0,
  Completed = 1,
  Canceled = 2
}

export interface AppointmentListPatient {
  id: number;
  fullName: string;
}
export interface AppointmentListTreatment {
  id: number;
  name: string;
}
export interface AppointmentListTherapist {
id: number;
fullName: string;
}
export interface AppointmentListRoom {
  id: number;
  name: string;
  number: string;
}


export interface AppointmentListItem {
  id: number;
  patient: AppointmentListPatient;
  treatment: AppointmentListTreatment;
  therapist: AppointmentListTherapist;
  room: AppointmentListRoom;
  startDateTime: string;
  status: string;
  outpatient: boolean;
}

export interface AppointmentDetailsPatient {
  id: number;
  fullName: string;
  phoneNumber?: string;
  notes?: string;
}
export interface AppointmentDetailsTreatment {
  id: number;
  name: string;
  durationMinutes: string;

}
export interface AppointmentDetailsTherapist {
id: number;
fullName: string;
roleName: string;
}
export interface AppointmentDetailsStay {
id: number;
participationId: number;
name: string;
}

export interface AppointmentDetailsRoom {
  id: number;
  name: string;
  number: string;
  typeName: string;
}

export interface AppointmentDetails {
  id: number;
 
  patient: AppointmentDetailsPatient;
  treatment: AppointmentDetailsTreatment;
  therapist: AppointmentDetailsTherapist;
  room: AppointmentDetailsRoom;
  stay?: AppointmentDetailsStay;
  
  startDateTime: string;
  status: string;  
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