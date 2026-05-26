import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { TextInput, Button, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useAppointments } from '../../context/AppointmentsContext';
import { CreateAppointmentRequest, AppointmentStatus, PatientListItem, Treatment, RehabRoom, Therapist, StayListItem } from '../../types/models';
import CustomHeader from '../../components/CustomHeader';
import { PickerField } from '../../components/PickerField'; 
import apiService from '../../api/apiService';
import DatePicker from 'react-native-date-picker';
import { TouchableWithoutFeedback } from 'react-native';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AddAppointmentScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  
  const [patientId, setPatientId] = useState<number | null>(null);
  const [treatmentId, setTreatmentId] = useState<number | null>(null);
  const [therapistId, setTherapistId] = useState<number | null>(null);
  const [roomId, setRoomId] = useState<number | null>(null);
  const [startDateTime, setStartDateTime] = useState(''); // np. 2026-05-08T10:00:00
  const [stayId, setStayId] = useState<number | null>(null);

  const [patients, setPatients] = useState<PatientListItem[]>([]);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [rehabRooms, setRehabRooms] = useState<RehabRoom[]>([]);
  const [stays, setStays] = useState<StayListItem[]>([]);

  const [date, setDate] = useState(new Date());
  const [openDatePicker, setOpenDatePicker] = useState(false);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { createAppointment } = useAppointments();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [pats, thers, treas, rehrs, sts] = await Promise.all([
          apiService.getPatients(),
          apiService.getTherapists(),
          apiService.getTreatments(),
          apiService.getRehabRooms(),
          apiService.getStays(),
        ]);
        setPatients(pats);
        setTherapists(thers);
        setTreatments(treas);
        setRehabRooms(rehrs);
        setStays(sts);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        Alert.alert('Error', 'Failed to load dictionary data. Check your connection.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSubmit = async () => {
    if (!patientId) {
      return Alert.alert('Validation Error', 'Picking a Patient is required.');
    }
    if (!treatmentId) {
      return Alert.alert('Validation Error', 'Picking a Treatment is required.');
    }
    if (!therapistId) {
      return Alert.alert('Validation Error', 'Picking a Therapist is required.');
    }
    if (!roomId) {
      return Alert.alert('Validation Error', 'Picking a Rehab Room is required.');
    }
    if (!startDateTime.trim()) {
      return Alert.alert('Validation Error', 'Start Date & Time is required.');
    }

    try {
      setSubmitting(true);
      
      const formData: CreateAppointmentRequest = {
        patientId: patientId,
        treatmentId: treatmentId,
        therapistId: therapistId,
        roomId: roomId,
        startDateTime: startDateTime.trim(),
        status: AppointmentStatus.Scheduled,
        stayId: stayId || undefined
      };

      console.log(formData)
      await createAppointment(formData);

      Alert.alert('Success', 'Appointment has been scheduled', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]); 
      
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      Alert.alert('Error', 'The appointment could not be saved. Check server logs.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} bounces={false}>
      <CustomHeader title="New Appointment" showBackButton={true} />

      <View style={styles.form}>
        
        <PickerField
          label="Patient"
          value={patientId}
          items={patients}
          getValue={x => x.id}
          getLabel={x => `${(x as any).firstName || ''} ${(x as any).lastName || ''}`.trim()}
          onChange={val => setPatientId(val as number | null)}
          placeholder="Pick a Patient..."
          required
          disabled={submitting}
        />

        <PickerField
          label="Treatment"
          value={treatmentId}
          items={treatments}
          getValue={x => x.id}
          getLabel={x => x.name || `ID: ${x.id}`}
          onChange={val => setTreatmentId(val as number | null)}
          placeholder="Pick a Treatment..."
          required
          disabled={submitting}
        />

        <PickerField
          label="Therapist"
          value={therapistId}
          items={therapists}
          getValue={x => x.id}
          getLabel={x => (x as any).fullName || `${(x as any).firstName || ''} ${(x as any).lastName || ''}`.trim()}
          onChange={val => setTherapistId(val as number | null)}
          placeholder="Pick a Therapist..."
          required
          disabled={submitting}
        />

        <PickerField
          label="Rehab Room"
          value={roomId}
          items={rehabRooms}
          getValue={x => x.id}
          getLabel={x => `${x.name} (${x.roomNumber})`}
          onChange={val => setRoomId(val as number | null)}
          placeholder="Pick a Room..."
          required
          disabled={submitting}
        />

        {/* Looks like TextInput*/}
        <TouchableWithoutFeedback 
        onPress={() => setOpenDatePicker(true)} 
        disabled={submitting}>
          <View>
            <TextInput 
              mode="outlined"
              label="Date & Time *"
              // show formatted value or " " when empty
              value={startDateTime ? date.toLocaleString('pl-PL', { 
                day: '2-digit', month: '2-digit', year: 'numeric', 
                hour: '2-digit', minute: '2-digit' 
              }) : ''}
              placeholder="Pick date and time"
              editable={false}
              right={<TextInput.Icon icon="calendar-clock" />} 
              style={styles.input}
              disabled={submitting}
              error={!startDateTime}
            />
          </View>
        </TouchableWithoutFeedback>

        {/* Appears after pressing on above*/}
        <DatePicker
          modal
          locale="en-GB"
          open={openDatePicker}
          date={date}
          mode="datetime"
          confirmText="Confirm"
          cancelText="Cancel"
          title="Pick appointment's date"
          onConfirm={(selectedDate) => {
            setOpenDatePicker(false);
            setDate(selectedDate); 
            setStartDateTime(selectedDate.toISOString()); // for backend
          }}
          onCancel={() => {
            setOpenDatePicker(false);
          }}
        />

        <PickerField
          label="Stay (Optional)"
          value={stayId}
          items={stays}
          getValue={x => x.id} 
          getLabel={x => x.name || `Stay #${x.id}`}
          onChange={val => setStayId(val as number | null)}
          placeholder="Outpatient (None)" 
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
  centerContainer: { justifyContent: 'center', alignItems: 'center' },
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