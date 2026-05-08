import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiService from '../api/apiService';
import type {  CreateRoomTypeRequest, RoomType, UpdateRoomTypeRequest } from '../types/models';

interface RoomTypesContextType {
    roomTypes: RoomType[];
    loading: boolean;
    error: string | null;

    // Actions
  refreshRoomTypes: () => Promise<void>;
  createRoomType: (data: CreateRoomTypeRequest) => Promise<void>;
  updateRoomType: (id: number, data: UpdateRoomTypeRequest) => Promise<void>;
  deleteRoomType: (id: number) => Promise<void>;

}

const RoomTypesContext = createContext<RoomTypesContextType | undefined>(undefined);


export function RoomTypesProvider({ children }: { children: ReactNode }) {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get all RoomTypes
  const refreshRoomTypes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getRoomTypes();
      setRoomTypes(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('Failed to load RoomTypes:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Create RoomType
  const createRoomType = async (data: CreateRoomTypeRequest) => {
    try {
      setError(null);
      await apiService.createRoomType(data);
      
      // Refresh list from API to get full data
      await refreshRoomTypes();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    }
  };

  // Update RoomType
  const updateRoomType = async (id: number, data: UpdateRoomTypeRequest) => {
    try {
      setError(null);
      await apiService.updateRoomType(id, data);
      
      // Refresh list from API to get full data
      await refreshRoomTypes();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    }
  };

  // Delete RoomType
  const deleteRoomType = async (id: number) => {
    try {
      setError(null);
      await apiService.deleteRoomType(id);
      
      // delete local
      setRoomTypes(prev => prev.filter(roomType => roomType.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    }
  };

  // Załaduj produkty przy montowaniu
  useEffect(() => {
    refreshRoomTypes();
  }, []);

  return (
    <RoomTypesContext.Provider
      value={{
        roomTypes,
        loading,
        error,
        refreshRoomTypes,
        createRoomType,
        updateRoomType,
        deleteRoomType,
      }}
    >
      {children}
    </RoomTypesContext.Provider>
  );
}

export function useRoomTypes() {
  const context = useContext(RoomTypesContext);
  if (!context) {
    throw new Error('useRoomTypes must be used withinRoomTypesProvider');
  }
  return context;
}