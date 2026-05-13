import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Button, useTheme, Text, Surface } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { PatientListItem, StayDetails } from '../../types/models';
import CustomHeader from '../../components/CustomHeader';
import { PickerField } from '../../components/PickerField';
import apiService from '../../api/apiService';

type Props = NativeStackScreenProps<RootStackParamList, 'AddPatientToStay'>;

const AddPatientToStayScreen: React.FC<Props> = ({ route, navigation }) => {
  const { stayId } = route.params;
  const theme = useTheme();

  const [patientId, setPatientId] = useState<number | null>(null);
  const [patients, setPatients] = useState<PatientListItem[]>([]);
  const [stayInfo, setStayInfo] = useState<StayDetails | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [pats, stay] = await Promise.all([
          apiService.getPatients(),
          apiService.getStay(stayId)
        ]);
        setPatients(pats);
        setStayInfo(stay);
      } catch (error) {
        Alert.alert('Error', 'Failed to load necessary data.');
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [stayId, navigation]);

  const handleSubmit = async () => {
    if (!patientId) {
      return Alert.alert('Validation Error', 'Please select a patient.');
    }

    try {
      setSubmitting(true);
      await apiService.addPatientToStay(stayId, patientId);

      Alert.alert('Success', 'Patient added to the stay.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]); 
    } catch (error) {
      Alert.alert('Error', 'Could not add the patient.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleDateString('pl-PL');
    } catch {
      return '--.--.----';
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerBox, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} bounces={false}>
      <CustomHeader title="Enroll Patient" showBackButton={true} />

      {stayInfo && (
        <Surface style={styles.stayBanner} elevation={1}>
          <View style={styles.bannerContent}>
            <View style={styles.bannerText}>
              <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>{stayInfo.name}</Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                Term: {formatDate(stayInfo.startDate)} - {formatDate(stayInfo.endDate)}
              </Text>
            </View>
          </View>
        </Surface>
      )}

      <View style={styles.form}>
        <Text variant="bodyMedium" style={styles.label}>
          Select a patient to be assigned to this stay:
        </Text>

        <PickerField
          label="Patient *"
          value={patientId}
          items={patients}
          getValue={x => x.id}
          getLabel={x => `${x.firstName} ${x.lastName} (PESEL: ${x.pesel})`}
          onChange={val => setPatientId(val as number | null)}
          placeholder="Search patient..."
          required
          disabled={submitting}
        />

        <View style={styles.buttonRow}>
          <Button mode="outlined" style={styles.button} onPress={() => navigation.goBack()} disabled={submitting}>
            Cancel
          </Button>
          <Button mode="contained" style={styles.button} onPress={handleSubmit} loading={submitting} disabled={submitting}>
            Add to Stay
          </Button>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  stayBanner: {
    margin: 20,
    marginBottom: 10,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerText: {
    marginLeft: 15,
  },
  form: { padding: 20 },
  label: { marginBottom: 15, color: '#666' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 },
  button: { flex: 0.48, paddingVertical: 5 },
});

export default AddPatientToStayScreen;