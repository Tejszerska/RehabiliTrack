import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, useTheme } from 'react-native-paper';
import CustomHeader from '../../components/CustomHeader';

const AddRoomTypeScreen = ({ navigation }: any) => {
  const theme = useTheme();
  const [name, setName] = useState('');

  const handleSave = async () => {
    // Tutaj logika API / Context
    Alert.alert("Sukces", "Dodano element");
    navigation.goBack();
  };

  return (
    <ScrollView style={{ backgroundColor: theme.colors.background }}>
      <CustomHeader title="Dodaj Nowy" />
      <View style={styles.form}>
        <TextInput
          mode="outlined"
          label="Nazwa"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <Button mode="contained" onPress={handleSave} style={styles.button}>
          Zapisz
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  form: { padding: 20 },
  input: { marginBottom: 15 },
  button: { marginTop: 10 }
});

export default AddRoomTypeScreen;