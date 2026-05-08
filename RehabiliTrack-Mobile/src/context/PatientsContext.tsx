import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiService from '../api/apiService';
import type {CreatePatientRequest, UpdatePatientRequest, PatientListItem } from '../types/models';

interface PatientsContextType {
    patients: PatientListItem[];
    loading: boolean;
    error: string | null;

    // Actions
  refreshPatients: () => Promise<void>;
  createPatient: (data: CreatePatientRequest) => Promise<void>;
  updatePatient: (id: number, data: UpdatePatientRequest) => Promise<void>;
  deletePatient: (id: number) => Promise<void>;

}

const PatientsContext = createContext<PatientsContextType | undefined>(undefined);


export function PatientsProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<PatientListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get all Patients
  const refreshPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getPatients();
      setPatients(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('Failed to load Patients:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Create Patient
  const createPatient = async (data: CreatePatientRequest) => {
    try {
      setError(null);
      await apiService.createPatient(data);
      
      // Refresh list from API to get full data
      await refreshPatients();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    }
  };

  // Update Patient
  const updatePatient = async (id: number, data: UpdatePatientRequest) => {
    try {
      setError(null);
      await apiService.updatePatient(id, data);
      
      // Refresh list from API to get full data
      await refreshPatients();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    }
  };

  // Delete Patient
  const deletePatient = async (id: number) => {
    try {
      setError(null);
      await apiService.deletePatient(id);
      
      // delete local
      setPatients(prev => prev.filter(patient => patient.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    }
  };

  // Załaduj produkty przy montowaniu
  useEffect(() => {
    refreshPatients();
  }, []);

  return (
    <PatientsContext.Provider
      value={{
        patients,
        loading,
        error,
        refreshPatients,
        createPatient,
        updatePatient,
        deletePatient,
      }}
    >
      {children}
    </PatientsContext.Provider>
  );
}

export function usePatients() {
  const context = useContext(PatientsContext);
  if (!context) {
    throw new Error('usePatients must be used withinPatientsProvider');
  }
  return context;
}