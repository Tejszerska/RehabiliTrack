import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiService from '../api/apiService';
import type {  CreateTreatmentRequest, Treatment, UpdateTreatmentRequest } from '../types/models';

interface TreatmentsContextType {
    treatments: Treatment[];
    loading: boolean;
    error: string | null;

    // Actions
  refreshTreatments: () => Promise<void>;
  createTreatment: (data: CreateTreatmentRequest) => Promise<void>;
  updateTreatment: (id: number, data: UpdateTreatmentRequest) => Promise<void>;
  deleteTreatment: (id: number) => Promise<void>;

}

const TreatmentsContext = createContext<TreatmentsContextType | undefined>(undefined);


export function TreatmentsProvider({ children }: { children: ReactNode }) {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get all Treatments
  const refreshTreatments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getTreatments();
      setTreatments(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('Failed to load Treatments:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Create Treatment
  const createTreatment = async (data: CreateTreatmentRequest) => {
    try {
      setError(null);
      await apiService.createTreatment(data);
      
      // Refresh list from API to get full data
      await refreshTreatments();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    }
  };

  // Update Treatment
  const updateTreatment = async (id: number, data: UpdateTreatmentRequest) => {
    try {
      setError(null);
      await apiService.updateTreatment(id, data);
      
      // Refresh list from API to get full data
      await refreshTreatments();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    }
  };

  // Delete Treatment
  const deleteTreatment = async (id: number) => {
    try {
      setError(null);
      await apiService.deleteTreatment(id);
      
      // delete local
      setTreatments(prev => prev.filter(treatment => treatment.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    }
  };

  // Załaduj produkty przy montowaniu
  useEffect(() => {
    refreshTreatments();
  }, []);

  return (
    <TreatmentsContext.Provider
      value={{
        treatments,
        loading,
        error,
        refreshTreatments,
        createTreatment,
        updateTreatment,
        deleteTreatment,
      }}
    >
      {children}
    </TreatmentsContext.Provider>
  );
}

export function useTreatments() {
  const context = useContext(TreatmentsContext);
  if (!context) {
    throw new Error('useTreatments must be used withinTreatmentsProvider');
  }
  return context;
}