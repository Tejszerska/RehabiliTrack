import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, useTheme, Text, Surface, IconButton } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { usePatients } from '../../context/PatientsContext';
import { UpdatePatientRequest } from '../../types/models';

type Props = NativeStackScreenProps<RootStackParamList, 'EditTherapist'>;


const EditTherapistScreen: React.FC<Props> = ({ route, navigation }) => {
  const { patientId } = route.params;

  const theme = useTheme();
  const { patients, updatePatient } = usePatients();  
  const patient = patients.find(p => p.id === patientId);

  const [firstName, setFirstName] = useState(patient?.firstName || '');
  const [lastName, setLastName] = useState(patient?.lastName || '');
  const [pesel, setPesel] = useState(patient?.pesel || '');
  const [phoneNumber, setPhoneNumber] = useState(patient?.phoneNumber || '');
  const [notes, setNotes] = useState(patient?.notes || '');

  const [submitting, setSubmitting] = useState(false);

  if (!patient) {
    return (
      <View style={styles.centerContainer}>
        <Text>Patient not found</Text>
      </View>
    );
  }

  const handleSubmit = async () => {

    try {
        // VALIDATION 
      if (!firstName.trim()) {
          Alert.alert('Error', 'First name is required');
          return; 
        }
      if (!lastName.trim()) {
          Alert.alert('Error', 'Last name i srequired');
          return;
        }
        if (!pesel.trim() || pesel.trim().length !== 11) {
          Alert.alert('Error', 'PESEL needs to be exactly 11 characters long');
          return;
        }

        // SENDING TO API
        setSubmitting(true); // block repeated submitting
        
        const formData: UpdatePatientRequest = {
          id: patientId,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          pesel: pesel.trim(),
          phoneNumber: phoneNumber.trim() === '' ? undefined : phoneNumber.trim(),
          notes: notes.trim() === '' ? undefined : notes.trim()
         };

        await updatePatient(patientId, formData);

          // SUCCESS
            Alert.alert('Success', 'Patient updated correctly', [
            { text: 'OK', onPress: () => navigation.goBack() }
          ]); 
          
          //ERRORS (server)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      Alert.alert('Error', 'There was a problem. Patient was not updated.');
    } finally {
      setSubmitting(false);
    }

  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} bounces={false}>
      
      {/* back arrow instead of default header */}
      <Surface style={[styles.header, { backgroundColor: theme.colors.primary }]} elevation={2}>
        <IconButton
          icon="arrow-left"
          iconColor={theme.colors.onPrimary}
          size={28}
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        />
        <Text variant="headlineMedium" style={styles.headerTitle}>
          Edit Patient
        </Text>
      </Surface>

      {/* form */}
      <View style={styles.form}>
        <TextInput 
          mode="outlined"
          label="First Name *"
          placeholder="e.g. John" 
          value={firstName}
          onChangeText={setFirstName}
          style={styles.input}
          disabled={submitting} // blocks edit when submiting
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
            loading={submitting} // React Native Paper -> loading icon
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
    flex: 1,
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

export default EditTherapistScreen;