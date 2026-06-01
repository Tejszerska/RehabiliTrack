import React, { createContext, useState, useEffect, useContext } from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';
import { jwtDecode } from 'jwt-decode';

interface AuthData {
  token: string | null;
  role: string | null;
  username: string | null; // <--- 1. Nowe pole w interfejsie
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
    username: null, 
    isLoading: true,
  });

  // decoding function
  const extractUserDataFromToken = (token: string) => {
    try {
      const decoded: any = jwtDecode(token);
      return {
        role: decoded.role || null,
        username: decoded.unique_name || null 
      };
    } catch (error) {
      return { role: null, username: null };
    }
  };

  // save token when login successful
  const setAuth = async (token: string) => {
    try {
      await EncryptedStorage.setItem("auth_token", token);
      const { role, username } = extractUserDataFromToken(token); 
      setAuthState({ token, role, username, isLoading: false });
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // logout function
  const logout = async () => {
    await EncryptedStorage.removeItem("auth_token");
    setAuthState({ token: null, role: null, username: null, isLoading: false });
  };

  // load data at the first render
  useEffect(() => {
    const getAuthState = async () => {
      try {
        const token = await EncryptedStorage.getItem("auth_token");
        
        if (token) {
          const { role, username } = extractUserDataFromToken(token);
          setAuthState({ token, role, username, isLoading: false });
        } else {
          setAuthState({ token: null, role: null, username: null, isLoading: false });
        }
      } catch (err) {
        setAuthState({ token: null, role: null, username: null, isLoading: false });
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