import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiService from '../api/apiService';
import type {  CreateTherapistRoleRequest, TherapistRole, UpdateTherapistRoleRequest } from '../types/models';

interface TherapistRolesContextType {
    therapistRoles: TherapistRole[];
    loading: boolean;
    error: string | null;

    // Actions
  refreshTherapistRoles: () => Promise<void>;
  createTherapistRole: (data: CreateTherapistRoleRequest) => Promise<void>;
  updateTherapistRole: (id: number, data: UpdateTherapistRoleRequest) => Promise<void>;
  deleteTherapistRole: (id: number) => Promise<void>;

}

const TherapistRolesContext = createContext<TherapistRolesContextType | undefined>(undefined);


export function TherapistRolesProvider({ children }: { children: ReactNode }) {
  const [therapistRoles, setTherapistRoles] = useState<TherapistRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get all TherapistRoles
  const refreshTherapistRoles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getTherapistRoles();
      setTherapistRoles(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('Failed to load TherapistRoles:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Create TherapistRole
  const createTherapistRole = async (data: CreateTherapistRoleRequest) => {
    try {
      setError(null);
      await apiService.createTherapistRole(data);
      
      // Refresh list from API to get full data
      await refreshTherapistRoles();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    }
  };

  // Update TherapistRole
  const updateTherapistRole = async (id: number, data: UpdateTherapistRoleRequest) => {
    try {
      setError(null);
      await apiService.updateTherapistRole(id, data);
      
      // Refresh list from API to get full data
      await refreshTherapistRoles();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    }
  };

  // Delete TherapistRole
  const deleteTherapistRole = async (id: number) => {
    try {
      setError(null);
      await apiService.deleteTherapistRole(id);
      
      // delete local
      setTherapistRoles(prev => prev.filter(therapistRole => therapistRole.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    }
  };

  // Załaduj produkty przy montowaniu
  useEffect(() => {
    refreshTherapistRoles();
  }, []);

  return (
    <TherapistRolesContext.Provider
      value={{
        therapistRoles,
        loading,
        error,
        refreshTherapistRoles,
        createTherapistRole,
        updateTherapistRole,
        deleteTherapistRole,
      }}
    >
      {children}
    </TherapistRolesContext.Provider>
  );
}

export function useTherapistRoles() {
  const context = useContext(TherapistRolesContext);
  if (!context) {
    throw new Error('useTherapistRoles must be used withinTherapistRolesProvider');
  }
  return context;
}