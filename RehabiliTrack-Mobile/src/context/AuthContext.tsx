import React, { createContext, useState, useEffect, useContext } from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';
import apiClient from '../api/apiService';
import { jwtDecode } from 'jwt-decode';

interface AuthData {
  token: string | null;
  role: string | null;
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
    role: null,
    isLoading: true,
  });

  // function to decode role 
  const extractRoleFromToken = (token: string): string | null => {
    try {
      const decoded: any = jwtDecode(token);
      return  decoded.role || null;
    } catch (error) {
      return null;
    }
  };

  // get data at the start of app function
  const getAuthState = async () => {
    try {
      const token = await EncryptedStorage.getItem("auth_token");
      
      if (token) {
        const role = extractRoleFromToken(token);
        // send token to apiService
        apiClient.setAuthToken(token);
        setAuthState({ token, role, isLoading: false });
      } else {
        setAuthState({ token: null, role: null, isLoading: false });
      }
    } catch (err) {
      setAuthState({ token: null, role: null, isLoading: false });
    }
  };

 // save token when login successful
  const setAuth = async (token: string) => {
    try {
      await EncryptedStorage.setItem("auth_token", token);
      const role = extractRoleFromToken(token);
      setAuthState({ token, role, isLoading: false });
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // logout funtion
  const logout = async () => {
    await EncryptedStorage.removeItem("auth_token");
    setAuthState({ token: null, role: null, isLoading: false });
  };

  // load data at the first render
  useEffect(() => {
    const getAuthState = async () => {
      try {
        const token = await EncryptedStorage.getItem("auth_token");
        
        if (token) {
          const role = extractRoleFromToken(token);
          setAuthState({ token, role, isLoading: false });
        } else {
          setAuthState({ token: null, role: null, isLoading: false });
        }
      } catch (err) {
        setAuthState({ token: null, role: null, isLoading: false });
      }
    };

    getAuthState(); 
  }, []); 

  return (
    <AuthContext.Provider value={{ ...authState, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);