import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useAppointments } from '../../context/AppointmentsContext';
import { CreateAppointmentRequest, AppointmentStatus } from '../../types/models';
import CustomHeader from '../../components/CustomHeader';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AddAppointmentScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { createAppointment } = useAppointments();

  const [patientId, setPatientId] = useState('');
  const [treatmentId, setTreatmentId] = useState('');
  const [therapistId, setTherapistId] = useState('');
  const [roomId, setRoomId] = useState('');
  const [startDateTime, setStartDateTime] = useState(''); //2026-05-08T10:00:00
  const [stayParticipationId, setStayParticipationId] = useState('');

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      if (!patientId || !treatmentId || !therapistId || !roomId || !startDateTime) {
        Alert.alert('Error', 'Fields marked with * are mandatory.');
        return;
      }

      const pId = parseInt(patientId, 10);
      const trId = parseInt(treatmentId, 10);
      const thId = parseInt(therapistId, 10);
      const rId = parseInt(roomId, 10);
      const sId = stayParticipationId.trim() ? parseInt(stayParticipationId, 10) : undefined;

      if (isNaN(pId) || isNaN(trId) || isNaN(thId) || isNaN(rId)) {
        Alert.alert('Error', 'ID must be a number');
        return;
      }

      setSubmitting(true);
      const formData: CreateAppointmentRequest = {
        patientId: pId,
        treatmentId: trId,
        therapistId: thId,
        roomId: rId,
        startDateTime: startDateTime.trim(),
        status: AppointmentStatus.Scheduled,
        stayParticipationId: sId
      };
      
      await createAppointment(formData);

      Alert.alert('Success', 'Appointment has been scheduled', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]); 
      
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      Alert.alert('Error', 'The appointment could not be saved.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} bounces={false}>
      <CustomHeader title="New Appointment" showBackButton={true} />

      <View style={styles.form}>
        <TextInput 
          mode="outlined"
          label="Patient ID *"
          placeholder="np. 5"
          keyboardType="numeric"
          value={patientId}
          onChangeText={setPatientId}
          style={styles.input}
          disabled={submitting}
        />

        <TextInput 
          mode="outlined"
          label="Treatment ID *"
          placeholder="np. 2"
          keyboardType="numeric"
          value={treatmentId}
          onChangeText={setTreatmentId}
          style={styles.input}
          disabled={submitting}
        />

        <TextInput 
          mode="outlined"
          label="Therapist ID *"
          placeholder="np. 1"
          keyboardType="numeric"
          value={therapistId}
          onChangeText={setTherapistId}
          style={styles.input}
          disabled={submitting}
        />

        <TextInput 
          mode="outlined"
          label="Room ID *"
          placeholder="np. 10"
          keyboardType="numeric"
          value={roomId}
          onChangeText={setRoomId}
          style={styles.input}
          disabled={submitting}
        />

        <TextInput 
          mode="outlined"
          label="Date & Time (ISO) *"
          placeholder="YYYY-MM-DDTHH:mm:ss" 
          value={startDateTime}
          onChangeText={setStartDateTime}
          style={styles.input}
          disabled={submitting}
        />

        <TextInput 
          mode="outlined"
          label="Stay Participation ID (Opcjonalnie)"
          placeholder="np. 1"
          keyboardType="numeric"
          value={stayParticipationId}
          onChangeText={setStayParticipationId}
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
           {submitting ? 'Saving...' : 'Save Appointment'}
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  form: { padding: 20 },
  input: { marginBottom: 15 },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingBottom: 40,
  },
  button: { flex: 0.48, paddingVertical: 5 },
});

export default AddAppointmentScreen;