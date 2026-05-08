import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiService from '../api/apiService';
import type {CreateAppointmentRequest, UpdateAppointmentRequest, AppointmentListItem } from '../types/models';

interface AppointmentsContextType {
    appointments: AppointmentListItem[];
    loading: boolean;
    error: string | null;

    // Actions
  refreshAppointments: () => Promise<void>;
  createAppointment: (data: CreateAppointmentRequest) => Promise<void>;
  updateAppointment: (id: number, data: UpdateAppointmentRequest) => Promise<void>;
  deleteAppointment: (id: number) => Promise<void>;

}

const AppointmentsContext = createContext<AppointmentsContextType | undefined>(undefined);


export function AppointmentsProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<AppointmentListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get all Appointments
  const refreshAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getAppointments();
      setAppointments(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('Failed to load Appointments:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Create Appointment
  const createAppointment = async (data: CreateAppointmentRequest) => {
    try {
      setError(null);
      await apiService.createAppointment(data);
      
      // Refresh list from API to get full data
      await refreshAppointments();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    }
  };

  // Update Appointment
  const updateAppointment = async (id: number, data: UpdateAppointmentRequest) => {
    try {
      setError(null);
      await apiService.updateAppointment(id, data);
      
      // Refresh list from API to get full data
      await refreshAppointments();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    }
  };

  // Delete Appointment
  const deleteAppointment = async (id: number) => {
    try {
      setError(null);
      await apiService.deleteAppointment(id);
      
      // delete local
      setAppointments(prev => prev.filter(appointment => appointment.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    }
  };

  // Załaduj produkty przy montowaniu
  useEffect(() => {
    refreshAppointments();
  }, []);

  return (
    <AppointmentsContext.Provider
      value={{
        appointments,
        loading,
        error,
        refreshAppointments,
        createAppointment,
        updateAppointment,
        deleteAppointment,
      }}
    >
      {children}
    </AppointmentsContext.Provider>
  );
}

export function useAppointments() {
  const context = useContext(AppointmentsContext);
  if (!context) {
    throw new Error('useAppointments must be used withinAppointmentsProvider');
  }
  return context;
}