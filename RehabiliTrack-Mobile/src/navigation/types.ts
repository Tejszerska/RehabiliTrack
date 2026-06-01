export type RootStackParamList = {
  Main: undefined; // do nawigacji 
  Home: undefined;

  // AUTH
  Login: undefined;
  RegisterUser: undefined;
  ChangePassword: undefined;

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
  RehabRoomsList: undefined;
  AddRehabRoom: undefined;
  EditRehabRoom: { roomId: number };

  // ROOM TYPES
  RoomTypesList: undefined;
  AddRoomType: undefined;
  EditRoomType: { roomTypeId: number };

  // THERAPIST ROLES 
  TherapistRolesList: undefined;
  AddTherapistRole: undefined;
  EditTherapistRole: { therapistRolesId: number };

  // TREATMENTS
  TreatmentsList: undefined;
  AddTreatment: undefined;
  EditTreatment: { treatmentId: number };

  // STAYS
  StayList: undefined;
  AddStay: undefined;
  EditStay: { stayId: number };
  StayDetails: { stayId: number };
  AddPatientToStay: { stayId: number };

  // APPOINTMENTS
  Appointments: undefined;
  AddAppointment: undefined;
  EditAppointment: { appointmentId: number };
  AppointmentDetails: { appointmentId: number };
};