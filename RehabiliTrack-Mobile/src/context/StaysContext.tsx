import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiService from '../api/apiService';
import type {  CreateStayRequest, StayListItem, UpdateStayRequest } from '../types/models';

interface StaysContextType {
  stays: StayListItem[];
  loading: boolean;
  error: string | null;
  currentStays: StayListItem[] | null;

  // Actions
  refreshStays: () => Promise<void>;
  createStay: (data: CreateStayRequest) => Promise<void>;
  updateStay: (id: number, data: UpdateStayRequest) => Promise<void>;
  deleteStay: (id: number) => Promise<void>;
  fetchCurrentStays: () => Promise<void>;
}

const StaysContext = createContext<StaysContextType | undefined>(undefined);

export function StaysProvider({ children }: { children: ReactNode }) {
  const [stays, setStays] = useState<StayListItem[]>([]);
  const [currentStays, setCurrentStays] = useState<StayListItem[] | null>(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get all Stays
  const refreshStays = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getStays();
      setStays(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('Failed to load Stays:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Create Stay
  const createStay = async (data: CreateStayRequest) => {
    try {
      setError(null);
      await apiService.createStay(data);
      await refreshStays();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    }
  };

  // Update Stay
  const updateStay = async (id: number, data: UpdateStayRequest) => {
    try {
      setError(null);
      await apiService.updateStay(id, data);
      await refreshStays();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    }
  };

  // Delete Stay
  const deleteStay = async (id: number) => {
    try {
      setError(null);
      await apiService.deleteStay(id);
      setStays(prev => prev.filter(stay => stay.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    }
  };

  const fetchCurrentStays = async () => {
    try {
      const activeStays = await apiService.getCurrentStays();
      setCurrentStays(activeStays);
    } catch (err) {
      console.error("Failed to fetch current stays", err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([
        refreshStays(),
        fetchCurrentStays()
      ]);
      setLoading(false);
    };
    
    init();
  }, []); 

  return (
    <StaysContext.Provider
      value={{
        stays,
        loading,
        error,
        currentStays,
        refreshStays,
        createStay,
        updateStay,
        deleteStay,
        fetchCurrentStays,
      }}
    >
      {children}
    </StaysContext.Provider>
  );
}

export function useStays() {
  const context = useContext(StaysContext);
  if (!context) {
    throw new Error('useStays must be used within StaysProvider');
  }
  return context;
}