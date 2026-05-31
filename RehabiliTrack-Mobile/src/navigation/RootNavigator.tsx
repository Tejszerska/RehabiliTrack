import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';

import MainContainer from '../screens/MainContainer'; 

// AUTH
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/Auth/LoginScreen';

// PATIENTS
import AddPatientScreen from '../screens/Patients/AddPatientScreen';
import PatientDetailsScreen from '../screens/Patients/PatientDetailsScreen';
import EditPatientScreen from '../screens/Patients/EditPatientScreen';

// THERAPISTS
import TherapistListScreen from '../screens/Therapists/TherapistListScreen';
import AddTherapistScreen from '../screens/Therapists/AddTherapistScreen';
import EditTherapistScreen from '../screens/Therapists/EditTherapistScreen';

// REHAB ROOMS
import RehabRoomsListScreen from '../screens/RehabRooms/RehabRoomsListScreen';
import AddRehabRoomScreen from '../screens/RehabRooms/AddRehabRoomScreen';
import EditRehabRoomScreen from '../screens/RehabRooms/EditRehabRoomScreen';

// ROOM TYPES
import RoomTypesListScreen from '../screens/RoomTypes/RoomTypesListScreen';
import AddRoomTypeScreen from '../screens/RoomTypes/AddRoomTypeScreen';
import EditRoomTypeScreen from '../screens/RoomTypes/EditRoomTypeScreen';

// THERAPIST ROLES
import TherapistRolesListScreen from '../screens/TherapistRoles/TherapistRolesListScreen';
import AddTherapistRolesScreen from '../screens/TherapistRoles/AddTherapistRolesScreen';
import EditTherapistRolesScreen from '../screens/TherapistRoles/EditTherapistRolesScreen';

// TREATMENTS
import TreatmentsListScreen from '../screens/Treatments/TreatmentsListScreen';
import AddTreatmentScreen from '../screens/Treatments/AddTreatmentScreen';
import EditTreatmentScreen from '../screens/Treatments/EditTreatmentScreen';

// STAYS
import AddStayScreen from '../screens/Stays/AddStayScreen';
import EditStayScreen from '../screens/Stays/EditStayScreen';
import StayDetailsScreen from '../screens/Stays/StayDetailsScreen';

// APPOINTMENTS
import AddAppointmentScreen from '../screens/Appointments/AddAppointmentScreen';
import EditAppointmentScreen from '../screens/Appointments/EditAppointmentScreen';
import AppointmentDetailsScreen from '../screens/Appointments/AppointmentDetailsScreen';
import AddPatientToStayScreen from '../screens/Stays/AddPatientToStayScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator(): React.JSX.Element | null {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>        
        
        {token ? (
          // === SCREENS FOR AUTHORIZED USERS ===
          <>
            <Stack.Screen name="Main" component={MainContainer} />

            {/*========== PATIENTS ========== */}
            <Stack.Screen name="PatientDetails" component={PatientDetailsScreen} />
            <Stack.Screen name="AddPatient" component={AddPatientScreen} />
            <Stack.Screen name="EditPatient" component={EditPatientScreen} />

            {/*========== THERAPISTS ========== */}
            <Stack.Screen name="TherapistsList" component={TherapistListScreen} />
            <Stack.Screen name="AddTherapist" component={AddTherapistScreen} />
            <Stack.Screen name="EditTherapist" component={EditTherapistScreen} />

            {/*========== REHAB ROOMS ========== */}
            <Stack.Screen name="RehabRoomsList" component={RehabRoomsListScreen} />
            <Stack.Screen name="AddRehabRoom" component={AddRehabRoomScreen} />
            <Stack.Screen name="EditRehabRoom" component={EditRehabRoomScreen} />

            {/*========== ROOM TYPES ========== */}
            <Stack.Screen name="RoomTypesList" component={RoomTypesListScreen} />
            <Stack.Screen name="AddRoomType" component={AddRoomTypeScreen} />
            <Stack.Screen name="EditRoomType" component={EditRoomTypeScreen} />

            {/*========== THERAPIST ROLES ========== */}
            <Stack.Screen name="TherapistRolesList" component={TherapistRolesListScreen} />
            <Stack.Screen name="AddTherapistRole" component={AddTherapistRolesScreen} />
            <Stack.Screen name="EditTherapistRole" component={EditTherapistRolesScreen} />

            {/*========== TREATMENTS ========== */}
            <Stack.Screen name="TreatmentsList" component={TreatmentsListScreen} />
            <Stack.Screen name="AddTreatment" component={AddTreatmentScreen} />
            <Stack.Screen name="EditTreatment" component={EditTreatmentScreen} />

            {/*========== STAYS ========== */}
            <Stack.Screen name="AddStay" component={AddStayScreen} />
            <Stack.Screen name="EditStay" component={EditStayScreen} />
            <Stack.Screen name="StayDetails" component={StayDetailsScreen} />
            <Stack.Screen name="AddPatientToStay" component={AddPatientToStayScreen} />

            {/*========== APPOINTMENTS ========== */}
            <Stack.Screen name="AddAppointment" component={AddAppointmentScreen} />
            <Stack.Screen name="EditAppointment" component={EditAppointmentScreen} />
            <Stack.Screen name="AppointmentDetails" component={AppointmentDetailsScreen} />
          </>
        ) : (
          // === SCREENS FOR UNAUTHORIZED USERS ===
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default RootNavigator;