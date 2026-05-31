import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import apiService from '../api/apiService';
import type {  CreateTherapistRequest, Therapist, UpdateTherapistRequest } from '../types/models';

interface TherapistsContextType {
    therapists: Therapist[];
    loading: boolean;
    error: string | null;

    // Actions
  refreshTherapists: () => Promise<void>;
  createTherapist: (data: CreateTherapistRequest) => Promise<void>;
  updateTherapist: (id: number, data: UpdateTherapistRequest) => Promise<void>;
  deleteTherapist: (id: number) => Promise<void>;

}

const TherapistsContext = createContext<TherapistsContextType | undefined>(undefined);


export function TherapistsProvider({ children }: { children: ReactNode }) {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get all Therapists
  const refreshTherapists = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getTherapists();
      setTherapists(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('Failed to load Therapists:', err);
    } finally {
      setLoading(false);
    }
}, []);
  
  // Create Therapist
  const createTherapist = async (data: CreateTherapistRequest) => {
    try {
      setError(null);
      await apiService.createTherapist(data);
      
      // Refresh list from API to get full data
      await refreshTherapists();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    }
  };

  // Update Therapist
  const updateTherapist = async (id: number, data: UpdateTherapistRequest) => {
    try {
      setError(null);
      await apiService.updateTherapist(id, data);
      
      // Refresh list from API to get full data
      await refreshTherapists();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    }
  };

  // Delete Therapist
  const deleteTherapist = async (id: number) => {
    try {
      setError(null);
      await apiService.deleteTherapist(id);
      
      // delete local
      setTherapists(prev => prev.filter(therapist => therapist.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    }
  };


  return (
    <TherapistsContext.Provider
      value={{
        therapists,
        loading,
        error,
        refreshTherapists,
        createTherapist,
        updateTherapist,
        deleteTherapist,
      }}
    >
      {children}
    </TherapistsContext.Provider>
  );
}

export function useTherapists() {
  const context = useContext(TherapistsContext);
  if (!context) {
    throw new Error('useTherapists must be used withinTherapistsProvider');
  }
  return context;
}