import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { TextInput, Button, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useTherapists } from '../../context/TherapistsContext';
import { CreateTherapistRequest, TherapistRole } from '../../types/models';
import CustomHeader from '../../components/CustomHeader';
import { PickerField } from '../../components/PickerField';
import apiService from '../../api/apiService';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AddTherapistScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { createTherapist } = useTherapists();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  
  const [roleId, setRoleId] = useState<number | null>(null);
  const [roles, setRoles] = useState<TherapistRole[]>([]);
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [notes, setNotes] = useState('');

  const [loadingRoles, setLoadingRoles] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const fetchedRoles = await apiService.getTherapistRoles();
        setRoles(fetchedRoles);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        Alert.alert('Error', 'Failed to load therapist roles.');
      } finally {
        setLoadingRoles(false);
      }
    };
    fetchRoles();
  }, []);

  const handleSubmit = async () => {
    try {
      // WALIDACJA
      if (!firstName.trim() || !lastName.trim() || !licenseNumber.trim() || !roleId) {
        Alert.alert('Validation Error', 'Fields marked with * are required.');
        return; 
      }

      setSubmitting(true);
      const formData: CreateTherapistRequest = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        licenseNumber: licenseNumber.trim(),
        therapistRoleId: roleId,
        phoneNumber: phoneNumber.trim() === '' ? undefined : phoneNumber.trim(),
        notes: notes.trim() === '' ? undefined : notes.trim(),
      };
      
      await createTherapist(formData);

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

  if (loadingRoles) {
    return (
      <View style={[styles.container, styles.centerBox, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} bounces={false}>
      <CustomHeader title="New Therapist" showBackButton={true} />

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

        <PickerField
          label="Therapist Role"
          value={roleId}
          items={roles}
          getValue={x => x.id}
          getLabel={x => x.name}
          onChange={val => setRoleId(val as number | null)}
          placeholder="Pick a role..."
          required
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
          <Button mode="outlined" style={styles.button} onPress={() => navigation.goBack()} disabled={submitting}>
            Cancel
          </Button>

          <Button mode="contained" style={styles.button} onPress={handleSubmit} loading={submitting} disabled={submitting}>
           {submitting ? 'Saving...' : 'Save Therapist'}
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  form: { padding: 20 },
  input: { marginBottom: 15 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, paddingBottom: 40 },
  button: { flex: 0.48, paddingVertical: 5 },
});

export default AddTherapistScreen;