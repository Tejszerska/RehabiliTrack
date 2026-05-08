import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, useTheme } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useTreatments } from '../../context/TreatmentsContext';
import { UpdateTreatmentRequest } from '../../types/models';
import CustomHeader from '../../components/CustomHeader';

type Props = NativeStackScreenProps<RootStackParamList, 'EditTreatment'>;

const EditTreatmentScreen: React.FC<Props> = ({ route, navigation }) => {
  const { treatmentId } = route.params;
  const theme = useTheme();
  const { treatments, updateTreatment } = useTreatments();

  const [name, setName] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const treatmentToEdit = treatments.find(t => t.id === treatmentId);
    if (treatmentToEdit) {
      setName(treatmentToEdit.name);
      setDurationMinutes(treatmentToEdit.durationMinutes.toString());
    }
  }, [treatmentId, treatments]);

  const handleSubmit = async () => {
    try {
      // VALIDATION 
      if (!name.trim()) {
        Alert.alert('Error', 'Name is required');
        return; 
      }

      if (!durationMinutes.trim()) {
        Alert.alert('Error', 'Duration is required');
        return; 
      }

      // SENDING TO API
      setSubmitting(true);
      const formData: UpdateTreatmentRequest = {
        id: treatmentId,
        name: name.trim(),
        durationMinutes: Number(durationMinutes.trim()),
      };
      
      await updateTreatment(treatmentId, formData);

      // SUCCESS
      Alert.alert('Success', 'Treatment updated correctly', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]); 
      
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      Alert.alert('Error', 'There was a problem. Changes were not saved.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} bounces={false}>
      <CustomHeader title="Edit Treatment" />

      {/* form */}
      <View style={styles.form}>
        <TextInput 
          mode="outlined"
          label="Name *"
          placeholder="e.g. Kinesitherapy" 
          value={name}
          onChangeText={setName}
          style={styles.input}
          disabled={submitting}
        />

        <TextInput 
          mode="outlined"
          label="Duration [min] *"
          placeholder="e.g. 15" 
          keyboardType="numeric" 
          value={durationMinutes}
          onChangeText={setDurationMinutes}
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
           {submitting ? 'Updating...' : 'Update Treatment'}
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

export default EditTreatmentScreen;