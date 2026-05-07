import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import MainContainer from '../screens/MainContainer'; 
import AddPatientScreen from '../screens/Patients/AddPatientScreen';
import PatientDetailsScreen from '../screens/Patients/PatientDetailsScreen';
import EditPatientScreen from '../screens/Patients/EditPatientScreen';


const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Main"
      >
        {/* Apps base: bottom nav and 'inside' screens */}
        <Stack.Screen 
          name="Main" 
          component={MainContainer}
          options={{ headerShown: false }} 
        />

        {/* overlay screens ('datails of x' & 'add x' & 'edit x') */}
        <Stack.Screen 
          name="PatientDetails" 
          component={PatientDetailsScreen}
          options={{ title: 'Patient\'s details' , headerShown: false }
          
        }
        />

        <Stack.Screen 
          name="AddPatient" 
          component={AddPatientScreen}
          options={{ title: 'Add new patient', headerShown: false }}
        />

        <Stack.Screen 
          name="EditPatient" 
          component={EditPatientScreen}
          options={{ title: 'Edit a patient', headerShown: false }}
        />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default RootNavigator;