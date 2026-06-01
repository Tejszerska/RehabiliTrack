import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Text, useTheme, Surface } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { ChangePasswordRequest } from '../../types/models';
import apiService from '../../api/apiService';
import CustomHeader from '../../components/CustomHeader';

const ChangePasswordScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChangePassword = async () => {
    // frontend validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setError("New password must be different from the current one.");
      return;
    }

    // send request
    try {
      setLoading(true);
      setError(null);

      const requestData: ChangePasswordRequest = {
        currentPassword: currentPassword,
        newPassword: newPassword,
      };

      const response = await apiService.changePassword(requestData);

      // success
      Alert.alert(
        "Success", 
        response.message || "Your password has been changed successfully.",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to change password. Please check your current password.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>

        <CustomHeader title="Change password" />
        
      <Surface style={styles.formSurface} elevation={2}>
        
        <Text variant="headlineSmall" style={styles.title}>Change Password</Text>
        <Text variant="bodyMedium" style={styles.subtitle}>Please enter your current and new password</Text>

        {error && (
          <View style={[styles.errorBox, { backgroundColor: theme.colors.errorContainer }]}>
            <Text style={{ color: theme.colors.error }}>{error}</Text>
          </View>
        )}

        <TextInput
          label="Current Password"
          mode="outlined"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry
          style={styles.input}
        />

        <TextInput
          label="New Password"
          mode="outlined"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          style={styles.input}
        />

        <TextInput
          label="Confirm New Password"
          mode="outlined"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={styles.input}
        />

        <Button
          mode="contained"
          onPress={handleChangePassword}
          loading={loading}
          disabled={loading}
          style={styles.submitButton}
          icon="lock-reset"
        >
          Update Password
        </Button>
        
      </Surface>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1  },
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
  submitButton: {
    marginTop: 10,
    paddingVertical: 5,
  },
  errorBox: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  }
});

export default ChangePasswordScreen;