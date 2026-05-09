import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, useTheme } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useRehabRooms } from '../../context/RehabRoomsContext';
import { UpdateRehabRoomRequest } from '../../types/models';
import CustomHeader from '../../components/CustomHeader';

type Props = NativeStackScreenProps<RootStackParamList, 'EditRehabRoom'>;

const EditRoomScreen: React.FC<Props> = ({ route, navigation }) => {
  const { roomId } = route.params;
  const theme = useTheme();
  const { rehabRooms, updateRehabRoom } = useRehabRooms();

  const [name, setName] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [capacity, setCapacity] = useState('');
  const [roomTypeId, setRoomTypeId] = useState(''); 

  const [submitting, setSubmitting] = useState(false);

  // Załadowanie istniejących danych pokoju do formularza
  useEffect(() => {
    const item = rehabRooms.find(r => r.id === roomId);
    if (item) {
      setName(item.name);
      setRoomNumber(item.roomNumber);
      setCapacity(item.capacity.toString()); // Zamiana liczby na tekst dla TextInput
      setRoomTypeId(item.roomTypeId.toString());
    }
  }, [roomId, rehabRooms]);

  const handleSubmit = async () => {
    try {
      // VALIDATION 
      if (!name.trim()) {
        Alert.alert('Error', 'Room name is required');
        return; 
      }
      if (!roomNumber.trim()) {
        Alert.alert('Error', 'Room number is required');
        return;
      }
      
      const parsedCapacity = parseInt(capacity.trim(), 10);
      if (!capacity.trim() || isNaN(parsedCapacity) || parsedCapacity <= 0) {
        Alert.alert('Error', 'Valid capacity is required');
        return;
      }

      const parsedRoomTypeId = parseInt(roomTypeId.trim(), 10);
      if (!roomTypeId.trim() || isNaN(parsedRoomTypeId)) {
        Alert.alert('Error', 'Valid Room Type ID is required');
        return;
      }

      // SENDING TO API
      setSubmitting(true);
      const formData: UpdateRehabRoomRequest = {
        id: roomId,
        name: name.trim(),
        roomNumber: roomNumber.trim(),
        capacity: parsedCapacity,
        roomTypeId: parsedRoomTypeId,
      };
      
      await updateRehabRoom(roomId, formData);

      // SUCCESS
      Alert.alert('Success', 'Room updated correctly', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]); 
      
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      Alert.alert('Error', 'There was a problem. Room was not updated.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} bounces={false}>
      <CustomHeader title="Edit Room" />

      {/* form */}
      <View style={styles.form}>
        <TextInput 
          mode="outlined"
          label="Room Name *"
          placeholder="e.g. Main Gym" 
          value={name}
          onChangeText={setName}
          style={styles.input}
          disabled={submitting}
        />

        <TextInput 
          mode="outlined"
          label="Room Number *"
          placeholder="e.g. 101A" 
          value={roomNumber}
          onChangeText={setRoomNumber}
          style={styles.input}
          disabled={submitting}
        />

        <TextInput 
          mode="outlined"
          label="Capacity *"
          placeholder="e.g. 5" 
          keyboardType="numeric" 
          value={capacity}
          onChangeText={setCapacity}
          style={styles.input}
          disabled={submitting}
        />

        <TextInput 
          mode="outlined"
          label="Room Type ID *"
          placeholder="e.g. 1" 
          keyboardType="numeric" 
          value={roomTypeId}
          onChangeText={setRoomTypeId}
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
           {submitting ? 'Updating...' : 'Update Room'}
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

export default EditRoomScreen;