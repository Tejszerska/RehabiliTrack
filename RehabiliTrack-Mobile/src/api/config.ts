import { Platform } from 'react-native';

const getBaseUrl = (): string => {
  if (__DEV__) {
    // DOCKER: Użyj lokalnego IP komputera (nie localhost!)
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:5258/api'; 
    } else if (Platform.OS === 'ios') {
      return 'http://192.168.0.21:5258/api';
    }
  }
  
  // Production
  return 'https://rehabilitrack.com/api';
};

export const API_BASE_URL = getBaseUrl();

// Debug
console.log('API_BASE_URL:', API_BASE_URL);
console.log('Platform:', Platform.OS);