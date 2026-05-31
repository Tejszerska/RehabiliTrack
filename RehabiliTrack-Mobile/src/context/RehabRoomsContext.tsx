import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import apiService from '../api/apiService';
import type {  CreateRehabRoomRequest, RehabRoom, UpdateRehabRoomRequest } from '../types/models';

interface RehabRoomsContextType {
    rehabRooms: RehabRoom[];
    loading: boolean;
    error: string | null;

    // Actions
  refreshRehabRooms: () => Promise<void>;
  createRehabRoom: (data: CreateRehabRoomRequest) => Promise<void>;
  updateRehabRoom: (id: number, data: UpdateRehabRoomRequest) => Promise<void>;
  deleteRehabRoom: (id: number) => Promise<void>;

}

const RehabRoomsContext = createContext<RehabRoomsContextType | undefined>(undefined);


export function RehabRoomsProvider({ children }: { children: ReactNode }) {
  const [rehabRooms, setRehabRooms] = useState<RehabRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get all RehabRooms
const refreshRehabRooms = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getRehabRooms();
      setRehabRooms(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('Failed to load RehabRooms:', err);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Create RehabRoom
  const createRehabRoom = async (data: CreateRehabRoomRequest) => {
    try {
      setError(null);
      await apiService.createRehabRoom(data);
      
      // Refresh list from API to get full data
      await refreshRehabRooms();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    }
  };

  // Update RehabRoom
  const updateRehabRoom = async (id: number, data: UpdateRehabRoomRequest) => {
    try {
      setError(null);
      await apiService.updateRehabRoom(id, data);
      
      // Refresh list from API to get full data
      await refreshRehabRooms();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    }
  };

  // Delete RehabRoom
  const deleteRehabRoom = async (id: number) => {
    try {
      setError(null);
      await apiService.deleteRehabRoom(id);
      
      // delete local
      setRehabRooms(prev => prev.filter(rehabRoom => rehabRoom.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    }
  };

  /*
  // Załaduj produkty przy montowaniu
  useEffect(() => {
    refreshRehabRooms();
  }, []);
  */


  return (
    <RehabRoomsContext.Provider
      value={{
        rehabRooms,
        loading,
        error,
        refreshRehabRooms,
        createRehabRoom,
        updateRehabRoom,
        deleteRehabRoom,
      }}
    >
      {children}
    </RehabRoomsContext.Provider>
  );
}

export function useRehabRooms() {
  const context = useContext(RehabRoomsContext);
  if (!context) {
    throw new Error('useRehabRooms must be used withinRehabRoomsProvider');
  }
  return context;
}