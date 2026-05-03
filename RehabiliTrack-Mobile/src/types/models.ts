export interface BaseEntity {
  id: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export type TherapistRole = 
  | 'Physiotherapist' 
  | 'Massage Therapist' 
  | 'Assistant' 
  | 'Art Therapist' 
  | 'Occupational Therapist';

export interface Therapist extends BaseEntity {
  firstName: string;
  lastName: string;
  licenseNumber: string; // PWZ
  role: TherapistRole;
  phoneNumber?: string;
  notes?: string;
}

export interface Patient extends BaseEntity {
  firstName: string;
  lastName: string;
  pesel: string;
  phoneNumber?: string;
  notes?: string;
}

export type RoomType = 
  | 'Kinesitherapy' 
  | 'PhysicalTherapy' 
  | 'Hydrotherapy' 
  | 'Massage' 
  | 'Cryotherapy' 
  | 'OccupationalTherapy';

export interface RehabRoom extends BaseEntity {
  roomNumber: string;
  name: string;
  type: RoomType;
  capacity: number;
}

export interface Treatment extends BaseEntity {
  name: string;
  durationMinutes: number;
}

export interface Stay extends BaseEntity {
    name: string;
    startDate: string;
    endDate: string;
}

export enum AppointmentStatus {
  Scheduled = 'Scheduled',
  Completed = 'Completed',
  Canceled = 'Canceled'
}

export interface Appointment extends BaseEntity {
  patientId: string;
  treatmentId: string;
  therapistId: string;
  roomId: string;
  startDateTime: string;
  status: AppointmentStatus;
  stayParticipationId?: string; //  if present Inpatient (turnusowy), if null Outpatient (ambulatoryjny)
}

export interface StayParticipation extends BaseEntity {
  patientId: string;
  stayId: string;
}