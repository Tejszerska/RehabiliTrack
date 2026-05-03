import React from 'react';
import { PaperProvider, MD3LightTheme as DefaultTheme } from 'react-native-paper'; 
import RootNavigator from './src/navigation/RootNavigator';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors, 
    // SŁOWNIK KOLORÓW
    primary: '#104112',
    onPrimary: '#FFFFFF',    
    secondary: '#8eb67f', 
    background: '#FDFBF7',
    surface: '#FFF9F0',
    error: '#B00020',
  },
};

const App = () => {
  return (
    <PaperProvider theme={theme}>
      <RootNavigator />      
    </PaperProvider>
  );
};

export default App;