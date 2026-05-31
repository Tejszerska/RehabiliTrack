import React, { createContext, useState, useEffect, useContext } from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';
import apiClient from '../api/apiService';

interface AuthData {
  token: string | null;
  isLoading: boolean;
}

interface AuthContextType extends AuthData {
  setAuth: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<AuthData>({
    token: null,
    isLoading: true,
  });

  // get data at the start of app function
  const getAuthState = async () => {
    try {
      const token = await EncryptedStorage.getItem("auth_token");
      
      if (token) {
        // Przekazujemy token do Twojego API Serwisu
        apiClient.setAuthToken(token);
        setAuthState({ token, isLoading: false });
      } else {
        setAuthState({ token: null, isLoading: false });
      }
    } catch (err) {
      setAuthState({ token: null, isLoading: false });
    }
  };

  // save token when login successful
  const setAuth = async (token: string) => {
    try {
      await EncryptedStorage.setItem("auth_token", token);
      
      apiClient.setAuthToken(token);      
      setAuthState({ token, isLoading: false });
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // logout funtion
  const logout = async () => {
    await EncryptedStorage.removeItem("auth_token");
    
    // Usuwamy token z Twojego API Serwisu
    apiClient.setAuthToken(null);
    
    setAuthState({ token: null, isLoading: false });
  };

  // load data at the first render
  useEffect(() => {
    getAuthState(); 
  }, []);

  return (
    <AuthContext.Provider value={{ ...authState, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);