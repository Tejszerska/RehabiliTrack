import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, ActivityIndicator, TouchableWithoutFeedback } from 'react-native';
import { TextInput, Button, useTheme } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useAppointments } from '../../context/AppointmentsContext';
import { UpdateAppointmentRequest, PatientListItem, Treatment, RehabRoom, Stay, Therapist } from '../../types/models';
import CustomHeader from '../../components/CustomHeader';
import { PickerField } from '../../components/PickerField'; 
import apiService from '../../api/apiService';
import DatePicker from 'react-native-date-picker';

type Props = NativeStackScreenProps<RootStackParamList, 'EditAppointment'>;

const EditAppointmentScreen: React.FC<Props> = ({ route, navigation }) => {
  const { appointmentId } = route.params;
  const theme = useTheme();
  const { updateAppointment } = useAppointments();

  // STANY DANYCH FORMULARZA (zmienione z tekstów na liczby)
  const [patientId, setPatientId] = useState<number | null>(null);
  const [treatmentId, setTreatmentId] = useState<number | null>(null);
  const [therapistId, setTherapistId] = useState<number | null>(null);
  const [roomId, setRoomId] = useState<number | null>(null);
  const [startDateTime, setStartDateTime] = useState(''); 
  const [stayParticipationId, setStayParticipationId] = useState<number | null>(null);

  // STANY DLA DATE PICKERA
  const [date, setDate] = useState(new Date());
  const [openDatePicker, setOpenDatePicker] = useState(false);

  // STANY SŁOWNIKÓW
  const [patients, setPatients] = useState<PatientListItem[]>([]);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [rehabRooms, setRehabRooms] = useState<RehabRoom[]>([]);
  const [stays, setStays] = useState<Stay[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // POBIERAMY WSZYSTKO NARAZ! 5 słowników + 1 detal wizyty
        const [pats, thers, treas, rehrs, sts, appointmentData] = await Promise.all([
          apiService.getPatients(),
          apiService.getTherapists(),
          apiService.getTreatments(),
          apiService.getRehabRooms(),
          apiService.getStays(),
          apiService.getAppointment(appointmentId) // Pobieramy detale
        ]);

        // 1. Zapisujemy słowniki
        setPatients(pats);
        setTherapists(thers);
        setTreatments(treas);
        setRehabRooms(rehrs);
        setStays(sts);

        // 2. Wypełniamy formularz danymi z backendu
        // UWAGA: Używamy zagnieżdżonych ścieżek!
        setPatientId(appointmentData.patient.id);
        setTreatmentId(appointmentData.treatment.id);
        setTherapistId(appointmentData.therapist.id);
        setRoomId(appointmentData.room.id);
        
        // Data dla backendu i dla obiektu Date kalendarza
        setStartDateTime(appointmentData.startDateTime);
        setDate(new Date(appointmentData.startDateTime));
        
        // Jeśli obiekt stay istnieje, ustawiamy jego ID
        if (appointmentData.stay) {
          // Upewnij się, czy to id, czy participationId wg Twojego modelu
          setStayParticipationId((appointmentData.stay as any).participationId || appointmentData.stay.id);
        }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        Alert.alert('Error', 'Could not fetch appointment data for editing.');
        navigation.goBack();
      } finally {
        setLoadingData(false);
      }
    };

    fetchAllData();
  }, [appointmentId, navigation]);

  const handleSubmit = async () => {
    if (!patientId || !treatmentId || !therapistId || !roomId || !startDateTime) {
      Alert.alert('Error', 'Fields marked with * are mandatory.');
      return;
    }

    try {
      setSubmitting(true);
      
      // Budujemy PŁASKI obiekt do wysyłki (PUT)
      const formData: UpdateAppointmentRequest = {
        id: appointmentId,
        patientId: patientId,
        treatmentId: treatmentId,
        therapistId: therapistId,
        roomId: roomId,
        startDateTime: startDateTime.trim(),
        stayParticipationId: stayParticipationId || undefined
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
        <PickerField
          label="Patient *"
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
          label="Treatment *"
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
          label="Therapist *"
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
          label="Rehab Room *"
          value={roomId}
          items={rehabRooms}
          getValue={x => x.id}
          getLabel={x => `${x.name} (${x.roomNumber})`}
          onChange={val => setRoomId(val as number | null)}
          placeholder="Pick a Room..."
          required
          disabled={submitting}
        />

        <TouchableWithoutFeedback 
          onPress={() => setOpenDatePicker(true)} 
          disabled={submitting}>
          <View>
            <TextInput 
              mode="outlined"
              label="Date & Time *"
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

        <DatePicker
          modal
          open={openDatePicker}
          date={date}
          mode="datetime"
          locale="en-GB" // Wymusza zegar 24h!
          confirmText="Confirm"
          cancelText="Cancel"
          title="Pick appointment's date"
          onConfirm={(selectedDate) => {
            setOpenDatePicker(false);
            setDate(selectedDate); 
            setStartDateTime(selectedDate.toISOString()); 
          }}
          onCancel={() => {
            setOpenDatePicker(false);
          }}
        />

        <PickerField
          label="Stay (Optional)"
          value={stayParticipationId}
          items={stays}
          getValue={x => (x as any).participationId || x.id} 
          getLabel={x => x.name || `Stay #${x.id}`}
          onChange={val => setStayParticipationId(val as number | null)}
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
           {submitting ? 'Updating...' : 'Update'}
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