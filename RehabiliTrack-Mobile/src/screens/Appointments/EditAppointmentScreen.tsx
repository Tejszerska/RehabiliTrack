import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { TextInput, Button, useTheme } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useAppointments } from '../../context/AppointmentsContext';
import { UpdateAppointmentRequest } from '../../types/models';
import CustomHeader from '../../components/CustomHeader';
import apiService from '../../api/apiService';

type Props = NativeStackScreenProps<RootStackParamList, 'EditAppointment'>;

const EditAppointmentScreen: React.FC<Props> = ({ route, navigation }) => {
  const { appointmentId } = route.params;
  const theme = useTheme();
  const { updateAppointment } = useAppointments();

  const [patientId, setPatientId] = useState('');
  const [treatmentId, setTreatmentId] = useState('');
  const [therapistId, setTherapistId] = useState('');
  const [roomId, setRoomId] = useState('');
  const [startDateTime, setStartDateTime] = useState(''); 
  const [stayParticipationId, setStayParticipationId] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      try {
        const data = await apiService.getAppointment(appointmentId);
        setPatientId(data.patientId.toString());
        setTreatmentId(data.treatmentId.toString());
        setTherapistId(data.therapistId.toString());
        setRoomId(data.roomId.toString());
        setStartDateTime(data.startDateTime);
        if (data.stayParticipationId) {
          setStayParticipationId(data.stayParticipationId.toString());
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        Alert.alert('Error', 'Could not fetch appointment data for editing.');
        navigation.goBack();
      } finally {
        setLoadingData(false);
      }
    };

    fetchAppointmentDetails();
  }, [appointmentId, navigation]);

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
      const formData: UpdateAppointmentRequest = {
        id: appointmentId,
        patientId: pId,
        treatmentId: trId,
        therapistId: thId,
        roomId: rId,
        startDateTime: startDateTime.trim(),
        stayParticipationId: sId
      };
      
      await updateAppointment(appointmentId, formData);

      Alert.alert('Success', 'Appointment has been updated', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]); 
      
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      Alert.alert('Error', 'The appointment could not be updated.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingData) {
    return (
      <View style={[styles.container, styles.centerBox, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} bounces={false}>
      <CustomHeader title="Edit Appointment" showBackButton={true} />

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
           {submitting ? 'Updating...' : 'Update Appointment'}
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerBox: { justifyContent: 'center', alignItems: 'center' },
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

export default EditAppointmentScreen;