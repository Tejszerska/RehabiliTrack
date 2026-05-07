export type RootStackParamList = {
  Main: undefined; // do nawigacji 
  Home: undefined;

  // PATIENTS
  PatientList: undefined;
  AddPatient: undefined;
  PatientDetails: {
    patientId: number
  }
  EditPatient: {
    patientId: number
  }
  
  // THERAPISTS
  TherapistsList: undefined; 
  AddTherapist: undefined;
  EditTherapist: { therapistId: number };
  

Appointments: undefined;
StayList: undefined;

  Profile: { 
    userId: number;
  };
};