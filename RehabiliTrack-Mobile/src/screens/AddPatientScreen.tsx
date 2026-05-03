import React from 'react';
import { View, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { TextInput, Button, useTheme, Text, Surface, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AddPatientScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const handleSave = () => {
    Alert.alert('System', 'Data saved (Mock)', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} bounces={false}>
      
      {/* back arrow instead of default header */}
      <Surface style={[styles.header, { backgroundColor: theme.colors.primary }]} elevation={2}>
        <IconButton
          icon="arrow-left"
          iconColor={theme.colors.onPrimary}
          size={28}
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        />
        <Text variant="headlineMedium" style={styles.headerTitle}>
          New Patient
        </Text>
      </Surface>

      {/* form */}
      <View style={styles.form}>
        <TextInput 
          mode="outlined"
          label="First Name"
          placeholder="e.g. John" 
          style={styles.input}
        />

        <TextInput 
          mode="outlined"
          label="Last Name"
          placeholder="e.g. Smith" 
          style={styles.input}
        />

        <TextInput 
          mode="outlined"
          label="PESEL"
          placeholder="11 digits" 
          keyboardType="numeric" 
          maxLength={11} 
          style={styles.input}
        />

        <TextInput 
          mode="outlined"
          label="Phone Number (Optional)"
          placeholder="+48 ..." 
          keyboardType="phone-pad" 
          style={styles.input}
        />

        <TextInput 
          mode="outlined"
          label="Internal Notes"
          placeholder="Medical history, allergies, etc." 
          multiline 
          numberOfLines={4} 
          style={styles.input}
        />

        <View style={styles.buttonRow}>
          <Button 
            mode="outlined" 
            style={styles.button}
            onPress={() => navigation.goBack()}
          >
            Cancel
          </Button>

          <Button 
            mode="contained" 
            style={styles.button}
            onPress={handleSave}
          >
            Save Patient
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
  header: {
    paddingTop: 40, 
    paddingBottom: 25,
    alignItems: 'center',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 40, 
    left: 10,
    zIndex: 10,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginTop: 10,
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

export default AddPatientScreen;