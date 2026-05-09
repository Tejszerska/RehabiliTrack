import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useStays } from '../../context/StaysContext';
import { CreateStayRequest } from '../../types/models';
import CustomHeader from '../../components/CustomHeader';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AddStayScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  
  const { createStay } = useStays();

  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [maxCapacity, setMaxCapacity] = useState('');

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {

      // VALIDATE
      if (!name.trim() || !startDate.trim() || !endDate.trim() || !maxCapacity.trim()) {
        Alert.alert('Error', 'All fields are required.');
        return;
      }

      const parsedCapacity = parseInt(maxCapacity.trim(), 10);
      if (isNaN(parsedCapacity) || parsedCapacity <= 0) {
        Alert.alert('Error', 'Max capacity must be a number greater than zero.');
        return;
      }

      // SEND
      setSubmitting(true);
      const formData: CreateStayRequest = {
        name: name.trim(),
        startDate: startDate.trim(), // e.g. 2026-09-01
        endDate: endDate.trim(),     // e.g. 2026-09-14
        maxCapacity: parsedCapacity,
      };
      
      await createStay(formData);
    // SUCCESS
      Alert.alert('Success', 'Stay has been successfully created.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]); 
      // ERROR
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      Alert.alert('Error', 'Failed to save the stay. Please check the provided data.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} bounces={false}>
      <CustomHeader title="New Stay" showBackButton={true} />

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
           {submitting ? 'Saving...' : 'Save Stay'}
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

export default AddStayScreen;