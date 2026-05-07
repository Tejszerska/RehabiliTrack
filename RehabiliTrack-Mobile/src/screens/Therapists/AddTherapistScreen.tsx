import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, useTheme} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useTherapists } from '../../context/TherapistsContext';
import { CreateTherapistRequest } from '../../types/models';
import CustomHeader from '../../components/CustomHeader';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AddTherapistScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { createTherapist } = useTherapists();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState(''); // Zmiana z pesel na licenseNumber
  const [roleId, setRoleId] = useState(''); // Dodano roleId wpisywane ręcznie
  const [phoneNumber, setPhoneNumber] = useState('');
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);

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
      if (!licenseNumber.trim()) {
        Alert.alert('Error', 'License number (PWZ) is required');
        return;
      }
      
      const parsedRoleId = parseInt(roleId.trim(), 10);
      if (!roleId.trim() || isNaN(parsedRoleId)) {
        Alert.alert('Error', 'Valid Role ID is required');
        return;
      }

      // SENDING TO API
      setSubmitting(true);
      const formData: CreateTherapistRequest = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        licenseNumber: licenseNumber.trim(), // Używamy licenseNumber
        therapistRoleId: parsedRoleId,       // Używamy zrzutowanego roleId
        phoneNumber: phoneNumber.trim() === '' ? undefined : phoneNumber.trim(),
        notes: notes.trim() === '' ? undefined : notes.trim(),
      };
      
      await createTherapist(formData);

      // SUCCESS
      Alert.alert('Success', 'Therapist saved correctly', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]); 
      
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      Alert.alert('Error', 'There was a problem. Therapist was not saved.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} bounces={false}>
      <CustomHeader title="New Therapist" />

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
          label="License (PWZ) *"
          placeholder="e.g. 1234567" 
          value={licenseNumber}
          onChangeText={setLicenseNumber}
          style={styles.input}
          disabled={submitting}
        />

        <TextInput 
          mode="outlined"
          label="Therapist Role ID *"
          placeholder="e.g. 1" 
          keyboardType="numeric" 
          value={roleId}
          onChangeText={setRoleId}
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
          placeholder="Specialties, availability, etc." 
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
           {submitting ? 'Saving...' : 'Save Therapist'}
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
});

export default AddTherapistScreen;