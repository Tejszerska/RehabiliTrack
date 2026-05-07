export type RootStackParamList = {
  Main: undefined; // do nawigacji 
  Home: undefined;

  PatientList: undefined;
  AddPatient: undefined;
  PatientDetails: {
    patientId: number
  }
  EditPatient: {
    patientId: number
  }

Appointments: undefined;
StayList: undefined;

  Profile: { 
    userId: number;
  };
};