import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, useTheme} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useTherapistRoles } from '../../context/TherapistRolesContext';
import { CreateTherapistRoleRequest } from '../../types/models';
import CustomHeader from '../../components/CustomHeader';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AddTherapistRoleScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const { createTherapistRole } = useTherapistRoles();

  const [name, setName] = useState('');

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      // VALIDATION 
      if (!name.trim()) {
        Alert.alert('Error', 'Name is required');
        return; 
      }

      // SENDING TO API
      setSubmitting(true);
      const formData: CreateTherapistRoleRequest = {
        name: name.trim(),
      };
      
      await createTherapistRole(formData);

      // SUCCESS
      Alert.alert('Success', 'Therapist role saved correctly', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]); 
      
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      Alert.alert('Error', 'There was a problem. Therapist role was not saved.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} bounces={false}>
      <CustomHeader title="New Therapist role" />

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
           {submitting ? 'Saving...' : 'Save Therapist role'}
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

export default AddTherapistRoleScreen;