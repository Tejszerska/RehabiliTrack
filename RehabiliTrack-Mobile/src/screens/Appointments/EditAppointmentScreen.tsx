import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, useTheme } from 'react-native-paper';
import CustomHeader from '../../components/CustomHeader';

const EditAppointmentScreen = ({ route, navigation }: any) => {
  const { itemId } = route.params;
  const theme = useTheme();

  // W edycji startujemy z danymi, które już istnieją
  const [name, setName] = useState(`Obecna nazwa ${itemId}`);

  const handleUpdate = () => {
    // API Call: updateItem(itemId, name)
    navigation.goBack();
  };

  return (
    <ScrollView style={{ backgroundColor: theme.colors.background }}>
      <CustomHeader title="Edytuj Element" />
      <View style={styles.form}>
        <TextInput
          mode="outlined"
          label="Zmień Nazwę"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <Button mode="contained" onPress={handleUpdate}>
          Zaktualizuj
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  form: { padding: 20 },
  input: { marginBottom: 15 }
});

export default EditAppointmentScreen;