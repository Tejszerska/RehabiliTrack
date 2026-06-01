import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Text, useTheme, SegmentedButtons, Surface } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import apiService from '../../api/apiService';
import type { RegisterRequest } from '../../types/models';
import CustomHeader from '../../components/CustomHeader';

const RegisterUserScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Receptionist');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    if (!username.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const requestData: RegisterRequest = {
        username: username.trim(),
        password: password,
        role: role
      };

      const newUserId = await apiService.registerUser(requestData);

      Alert.alert(
        "Success", 
        `User ${username} created successfully with ID: ${newUserId}`,
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>

      <CustomHeader title="New User" />
      
      <Surface style={styles.formSurface} elevation={2}>
        
        <Text variant="headlineSmall" style={styles.title}>Register New User</Text>
        <Text variant="bodyMedium" style={styles.subtitle}>Create an account for a new employee</Text>

        {error && (
          <View style={[styles.errorBox, { backgroundColor: theme.colors.errorContainer }]}>
            <Text style={{ color: theme.colors.error }}>{error}</Text>
          </View>
        )}

        <TextInput
          label="Username"
          mode="outlined"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          style={styles.input}
        />

        <TextInput
          label="Password"
          mode="outlined"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        <Text variant="labelLarge" style={styles.roleLabel}>Select Role:</Text>
        <SegmentedButtons
          value={role}
          onValueChange={setRole}
          buttons={[
            {
              value: 'Receptionist',
              label: 'Receptionist',
              icon: 'account-heart',
            },
            {
              value: 'Admin',
              label: 'Admin',
              icon: 'shield-account',
            },
          ]}
          style={styles.segmentedButtons}
        />

        <Button
          mode="contained"
          onPress={handleRegister}
          loading={loading}
          disabled={loading}
          style={styles.submitButton}
        >
          Create User
        </Button>
        
      </Surface>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formSurface: {
    padding: 20,
    borderRadius: 12,
    marginTop: 10,
    backgroundColor: 'white'
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    color: '#666',
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
  },
  roleLabel: {
    marginTop: 10,
    marginBottom: 10,
    color: '#333'
  },
  segmentedButtons: {
    marginBottom: 25,
  },
  submitButton: {
    paddingVertical: 5,
  },
  errorBox: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  }
});

export default RegisterUserScreen;