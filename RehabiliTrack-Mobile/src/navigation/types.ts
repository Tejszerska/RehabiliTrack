export type RootStackParamList = {
  Main: undefined; // do nawigacji 
  Home: undefined;

  // PATIENTS
  PatientList: undefined;
  AddPatient: undefined;
  PatientDetails: {
    patientId: number
  };
  EditPatient: {
    patientId: number
  };
  
  // THERAPISTS
  TherapistsList: undefined; 
  AddTherapist: undefined;
  EditTherapist: { therapistId: number };

  // REHAB ROOMS
  RoomsList: undefined; 
  AddRoom: undefined;
  EditRoom: { roomId: number };

  // ROOM TYPES
  RoomTypesList: undefined;
  AddRoomType: undefined;
  EditRoomType: { roomTypeId: number };

  // THERAPIST ROLES 
  TherapistRolesList: undefined;
  AddTherapistRoles: undefined;
  EditTherapistRoles: { therapistRolesId: number };

  // TREATMENTS
  TreatmentsList: undefined;
  AddTreatment: undefined;
  EditTreatment: { treatmentId: number };

  // STAYS
  StayList: undefined;
  AddStay: undefined;
  EditStay: { stayId: number };
  StayDetails: { stayId: number }; 

  // APPOINTMENTS
  Appointments: undefined; 
  AddAppointment: undefined;
  EditAppointment: { appointmentId: number };
  AppointmentDetails: { appointmentId: number };
};