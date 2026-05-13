import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { TextInput, Button, useTheme} from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { usePatients } from '../../context/PatientsContext';
import { UpdatePatientRequest } from '../../types/models';
import CustomHeader from '../../components/CustomHeader';
import apiService from '../../api/apiService';

type Props = NativeStackScreenProps<RootStackParamList, 'EditPatient'>;

const EditPatientScreen: React.FC<Props> = ({ route, navigation }) => {
  const { patientId } = route.params;

  const theme = useTheme();
  const { updatePatient } = usePatients();  

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [pesel, setPesel] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [loadingData, setLoadingData] = useState(true); 
  // get full data 
  useEffect(() => {
    const fetchFullPatientData = async () => {
      try {
        const fullPatient = await apiService.getPatient(patientId);
        if (fullPatient) {
          setFirstName(fullPatient.firstName || '');
          setLastName(fullPatient.lastName || '');
          setPesel(fullPatient.pesel || '');
          setPhoneNumber(fullPatient.phoneNumber || '');
          setNotes(fullPatient.notes || '');
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        Alert.alert('Error', 'Could not fetch patient details for editing.');
        navigation.goBack();
      } finally {
        setLoadingData(false);
      }
    };

    fetchFullPatientData();
  }, [patientId, navigation]);

  const handleSubmit = async () => {
    try {
        // VALIDATION 
      if (!firstName.trim()) {
          Alert.alert('Error', 'First name is required');
          return; 
        }
      if (!lastName.trim()) {
          Alert.alert('Error', 'Last name is required');
          return;
        }
        if (!pesel.trim() || pesel.trim().length !== 11) {
          Alert.alert('Error', 'PESEL needs to be exactly 11 characters long');
          return;
        }

        // SENDING TO API
        setSubmitting(true);
        
        const safePhone = phoneNumber ? phoneNumber.trim() : '';
        const safeNotes = notes ? notes.trim() : '';

        const formData: UpdatePatientRequest = {
          id: patientId,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          pesel: pesel.trim(),
          phoneNumber: safePhone === '' ? undefined : safePhone,
          notes: safeNotes === '' ? undefined : safeNotes
         };

        await updatePatient(patientId, formData);

        // SUCCESS
        Alert.alert('Success', 'Patient updated correctly', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]); 
          
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      Alert.alert('Error', 'There was a problem. Patient was not updated.');
    } finally {
      setSubmitting(false);
    }
  };

  // lloadig
  if (loadingData) {
    return (
      <View style={[styles.container, styles.centerContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} bounces={false}>
      
      <CustomHeader title="Edit Patient" />

      {/* form */}
      <View style={styles.form}>
        <TextInput 
          mode="outlined"
          label="First Name *"
          placeholder="e.g. John" 
          value={firstName}
          onChangeText={setFirstName}
          style={styles.input}
          disabled={submitting}
        />

        <TextInput 
          mode="outlined"
          label="Last Name *"
          placeholder="e.g. Smith" 
          value={lastName}
          onChangeText={setLastName}
          style={styles.input}
          disabled={submitting}
        />

        <TextInput 
          mode="outlined"
          label="PESEL *"
          placeholder="11 digits" 
          keyboardType="numeric" 
          maxLength={11} 
          value={pesel}
          onChangeText={setPesel}
          style={styles.input}
          disabled={submitting}
        />

        <TextInput 
          mode="outlined"
          label="Phone Number (Optional)"
          placeholder="+48 ..." 
          keyboardType="phone-pad" 
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          style={styles.input}
          disabled={submitting}
        />

        <TextInput 
          mode="outlined"
          label="Internal Notes"
          placeholder="Medical history, allergies, etc." 
          multiline 
          numberOfLines={4} 
          value={notes}
          onChangeText={setNotes}
          style={styles.input}
          disabled={submitting}
        />

        <View style={styles.buttonRow}>
          <Button 
            mode="outlined" 
            style={styles.button}
            onPress={() => navigation.goBack()}
            disabled={submitting}
          >
            Cancel
          </Button>

          <Button 
            mode="contained" 
            style={styles.button}
            onPress={handleSubmit}
            loading={submitting}
            disabled={submitting}
          >
           {submitting ? 'Saving...' : 'Update'}
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingTop: 40, 
    paddingBottom: 25,
    alignItems: 'center',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 40, 
    left: 10,
    zIndex: 10,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginTop: 10,
  },
  form: {
    padding: 20,
  },
  input: {
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingBottom: 40,
  },
  button: {
    flex: 0.48,
    paddingVertical: 5,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
    marginBottom: 20,
    paddingHorizontal: 5,
  }
});

export default EditPatientScreen;