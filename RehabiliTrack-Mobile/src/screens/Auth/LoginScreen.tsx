import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import { useAuth } from '../../context/AuthContext';
import apiService from '../../api/apiService'; 

const LoginScreen = () => {
  const theme = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuth();

  const handleLogin = async () => {
    // VALIDATE
    if (!username.trim() || !password.trim()) {
      Alert.alert('Błąd', 'Proszę podać login i hasło.');
      return;
    }

    // LOGIN 
    try {
      setLoading(true);      
      const response = await apiService.login(username.trim(), password);
      // get token and send to safe
      await setAuth(response.token); 

    } catch (error: any) {
      console.log("LOGIN ERROR DETAILS:", error.message);
      Alert.alert('Login error', 'Wrong username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      
      <View style={styles.headerContainer}>
        <Text variant="displaySmall" style={[styles.title, { color: theme.colors.primary }]}>RehabiliTrack</Text>
        <Text variant="bodyLarge" style={[styles.subtitle, { color: theme.colors.shadow }]}>Login to acces the system</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          mode="outlined"
          label="Login"
          placeholder="Type your username here"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          disabled={loading}
          autoCapitalize="none"
        />

        <TextInput
          mode="outlined"
          label="Password"
          placeholder="Type your password here"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry={true}
          disabled={loading}
        />

        <Button
          mode="contained"
          style={styles.button}
          contentStyle={styles.buttonContent}
          onPress={handleLogin}
          loading={loading}
          disabled={loading}
        >
          {loading ? 'Logging...' : 'Login'}
        </Button>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontWeight: 'bold',
  },
  subtitle: {
    marginTop: 5,
  },
  form: {
    paddingHorizontal: 20,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});

export default LoginScreen;