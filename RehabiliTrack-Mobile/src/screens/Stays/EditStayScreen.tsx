import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, ActivityIndicator, TouchableWithoutFeedback } from 'react-native';
import { TextInput, Button, useTheme } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useStays } from '../../context/StaysContext';
import { UpdateStayRequest } from '../../types/models';
import CustomHeader from '../../components/CustomHeader';
import DatePicker from 'react-native-date-picker';

type Props = NativeStackScreenProps<RootStackParamList, 'EditStay'>;

const EditStayScreen: React.FC<Props> = ({ route, navigation }) => {
  const { stayId } = route.params;
  const theme = useTheme();
  
  const { stays, updateStay } = useStays();

  const [name, setName] = useState('');
  const [maxCapacity, setMaxCapacity] = useState('');

  // Stany dla DatePickerów
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [openStartPicker, setOpenStartPicker] = useState(false);
  const [openEndPicker, setOpenEndPicker] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    // Pobieramy podstawowe dane z listy w kontekście
    const stayToEdit = stays.find(s => s.id === stayId);
    if (stayToEdit) {
      setName(stayToEdit.name);
      setStartDate(new Date(stayToEdit.startDate)); 
      setEndDate(new Date(stayToEdit.endDate));
      setMaxCapacity(stayToEdit.maxCapacity.toString());
      setLoadingData(false);
    } else {
      Alert.alert('Error', 'Stay not found.');
      navigation.goBack();
    }
  }, [stayId, stays, navigation]);

  const handleSubmit = async () => {
    try {
      // VALIDATE
      if (!name.trim() || !startDate || !endDate || !maxCapacity.trim()) {
        Alert.alert('Error', 'All fields are required.');
        return;
      }

      if (endDate < startDate) {
        Alert.alert('Error', 'End Date cannot be earlier than Start Date.');
        return;
      }

      const parsedCapacity = parseInt(maxCapacity.trim(), 10);
      if (isNaN(parsedCapacity) || parsedCapacity <= 0) {
        Alert.alert('Error', 'Max capacity must be a number greater than zero.');
        return;
      }

      // SET PAYLOAD
      setSubmitting(true);
      const formData: UpdateStayRequest = {
        id: stayId,
        name: name.trim(),
        startDate: startDate.toISOString().split('T')[0], 
        endDate: endDate.toISOString().split('T')[0],     
        maxCapacity: parsedCapacity,
      };
      
      // SEND
      await updateStay(stayId, formData);

      Alert.alert('Success', 'Stay has been successfully updated.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]); 
      
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      Alert.alert('Error', 'Failed to update the stay. Please check the provided data.');
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
      <CustomHeader title="Edit Stay" showBackButton={true} />

      <View style={styles.form}>
        <TextInput 
          mode="outlined"
          label="Stay Name *"
          placeholder="e.g. Autumn Stay 2026"
          value={name}
          onChangeText={setName}
          style={styles.input}
          disabled={submitting}
        />

        {/* Start Date Picker */}
        <TouchableWithoutFeedback onPress={() => setOpenStartPicker(true)} disabled={submitting}>
          <View>
            <TextInput 
              mode="outlined"
              label="Start Date *"
              value={startDate ? startDate.toLocaleDateString('pl-PL') : ''}
              placeholder="Pick start date"
              editable={false}
              right={<TextInput.Icon icon="calendar" />}
              style={styles.input}
              disabled={submitting}
            />
          </View>
        </TouchableWithoutFeedback>
        <DatePicker
          modal
          open={openStartPicker}
          date={startDate || new Date()}
          mode="date"
          locale="en-GB"
          confirmText="Confirm"
          cancelText="Cancel"
          title="Pick Start Date"
          onConfirm={(date) => {
            setOpenStartPicker(false);
            setStartDate(date);
          }}
          onCancel={() => setOpenStartPicker(false)}
        />

        {/* End Date Picker */}
        <TouchableWithoutFeedback onPress={() => setOpenEndPicker(true)} disabled={submitting}>
          <View>
            <TextInput 
              mode="outlined"
              label="End Date *"
              value={endDate ? endDate.toLocaleDateString('pl-PL') : ''}
              placeholder="Pick end date"
              editable={false}
              right={<TextInput.Icon icon="calendar" />}
              style={styles.input}
              disabled={submitting}
            />
          </View>
        </TouchableWithoutFeedback>
        <DatePicker
          modal
          open={openEndPicker}
          date={endDate || startDate || new Date()} 
          minimumDate={startDate || undefined}
          mode="date"
          locale="en-GB"
          confirmText="Confirm"
          cancelText="Cancel"
          title="Pick End Date"
          onConfirm={(date) => {
            setOpenEndPicker(false);
            setEndDate(date);
          }}
          onCancel={() => setOpenEndPicker(false)}
        />

        <TextInput 
          mode="outlined"
          label="Max Capacity *"
          placeholder="e.g. 20"
          keyboardType="numeric"
          value={maxCapacity}
          onChangeText={setMaxCapacity}
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
           {submitting ? 'Updating...' : 'Update Stay'}
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

export default EditStayScreen;