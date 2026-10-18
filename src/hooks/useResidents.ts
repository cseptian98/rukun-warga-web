import { useState, useEffect, useCallback } from 'react';
import { Resident, INITIAL_RESIDENTS } from '@/data/initialResidents';

export const RESIDENTS_STORAGE_KEY = 'ksm_resident_directory';
export const RESIDENTS_SYNC_EVENT = 'ksm_residents_updated';

export function useResidents() {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Load from localStorage or initialize with INITIAL_RESIDENTS
  const loadResidents = useCallback(() => {
    try {
      const stored = localStorage.getItem(RESIDENTS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setResidents(parsed);
          setIsLoaded(true);
          return;
        }
      }
      // If empty or null, seed with INITIAL_RESIDENTS
      localStorage.setItem(RESIDENTS_STORAGE_KEY, JSON.stringify(INITIAL_RESIDENTS));
      setResidents(INITIAL_RESIDENTS);
    } catch (error) {
      console.error('Failed to load residents from localStorage:', error);
      setResidents(INITIAL_RESIDENTS);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    loadResidents();

    // Listen for sync event across components and tabs
    const handleSync = () => {
      try {
        const stored = localStorage.getItem(RESIDENTS_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setResidents(parsed);
          }
        }
      } catch (err) {
        console.error('Error handling resident sync event:', err);
      }
    };

    window.addEventListener(RESIDENTS_SYNC_EVENT, handleSync);
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === RESIDENTS_STORAGE_KEY) {
        handleSync();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener(RESIDENTS_SYNC_EVENT, handleSync);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [loadResidents]);

  const dispatchUpdate = () => {
    window.dispatchEvent(new CustomEvent(RESIDENTS_SYNC_EVENT));
  };

  const addResident = useCallback((newResidentData: Omit<Resident, 'id'> | Resident): Resident => {
    const id = 'id' in newResidentData && newResidentData.id ? newResidentData.id : `res-${Date.now()}`;
    const resident: Resident = {
      ...newResidentData,
      id,
    };

    setResidents((prev) => {
      const updated = [...prev, resident];
      try {
        localStorage.setItem(RESIDENTS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save resident to localStorage', e);
      }
      return updated;
    });

    dispatchUpdate();
    return resident;
  }, []);

  const updateResident = useCallback((id: string, updatedFields: Partial<Resident>) => {
    setResidents((prev) => {
      const updated = prev.map((r) => (r.id === id ? { ...r, ...updatedFields } : r));
      try {
        localStorage.setItem(RESIDENTS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to update resident in localStorage', e);
      }
      return updated;
    });

    dispatchUpdate();
  }, []);

  const deleteResident = useCallback((id: string) => {
    setResidents((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      try {
        localStorage.setItem(RESIDENTS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to delete resident from localStorage', e);
      }
      return updated;
    });

    dispatchUpdate();
  }, []);

  const resetResidents = useCallback(() => {
    try {
      localStorage.setItem(RESIDENTS_STORAGE_KEY, JSON.stringify(INITIAL_RESIDENTS));
      setResidents(INITIAL_RESIDENTS);
    } catch (e) {
      console.error('Failed to reset residents in localStorage', e);
    }

    dispatchUpdate();
  }, []);

  return {
    residents,
    isLoaded,
    addResident,
    updateResident,
    deleteResident,
    resetResidents,
  };
}
