import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { TextInput, Button, useTheme } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useStays } from '../../context/StaysContext';
import { UpdateStayRequest } from '../../types/models';
import CustomHeader from '../../components/CustomHeader';

type Props = NativeStackScreenProps<RootStackParamList, 'EditStay'>;

const EditStayScreen: React.FC<Props> = ({ route, navigation }) => {
  const { stayId } = route.params;
  const theme = useTheme();
  
  const { stays, updateStay } = useStays();

  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [maxCapacity, setMaxCapacity] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const stayToEdit = stays.find(s => s.id === stayId);
    if (stayToEdit) {
      setName(stayToEdit.name);
      setStartDate(stayToEdit.startDate); 
      setEndDate(stayToEdit.endDate);
      setMaxCapacity(stayToEdit.maxCapacity.toString());
      setLoadingData(false);
    } else {
      Alert.alert('Error', 'Stay not found.');
      navigation.goBack();
    }
  }, [stayId, stays, navigation]);

  const handleSubmit = async () => {
    try {
      // 1. Validation for empty fields
      if (!name.trim() || !startDate.trim() || !endDate.trim() || !maxCapacity.trim()) {
        Alert.alert('Error', 'All fields are required.');
        return;
      }

      // 2. Capacity validation
      const parsedCapacity = parseInt(maxCapacity.trim(), 10);
      if (isNaN(parsedCapacity) || parsedCapacity <= 0) {
        Alert.alert('Error', 'Max capacity must be a number greater than zero.');
        return;
      }

      // 3. Sending to API
      setSubmitting(true);
      const formData: UpdateStayRequest = {
        id: stayId, // Required for updates
        name: name.trim(),
        startDate: startDate.trim(), 
        endDate: endDate.trim(),     
        maxCapacity: parsedCapacity,
      };
      
      await updateStay(stayId, formData);

      // 4. Success
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

        <TextInput 
          mode="outlined"
          label="Start Date *"
          placeholder="YYYY-MM-DD (e.g. 2026-09-01)"
          value={startDate}
          onChangeText={setStartDate}
          style={styles.input}
          disabled={submitting}
        />

        <TextInput 
          mode="outlined"
          label="End Date *"
          placeholder="YYYY-MM-DD (e.g. 2026-09-14)"
          value={endDate}
          onChangeText={setEndDate}
          style={styles.input}
          disabled={submitting}
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