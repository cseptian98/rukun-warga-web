import { useState, useEffect } from 'react';
import { Neighbor, Reading } from '@/types';

const STORAGE_KEY_NEIGHBORS = 'water_system_neighbors';
const STORAGE_KEY_READINGS = 'water_system_readings';

const DEFAULT_NEIGHBORS: Neighbor[] = [
  {
    id: "n-1",
    name: "Arthur Morgan",
    address: "Block A No. 12",
    joinDate: new Date().toISOString(),
    lastReadingDate: new Date().toISOString(),
    lastReadingVolume: 18.5,
    totalUnpaid: 22.75
  },
  {
    id: "n-2",
    name: "John Marston",
    address: "Block B No. 04",
    joinDate: new Date().toISOString(),
    lastReadingDate: new Date().toISOString(),
    lastReadingVolume: 12.0,
    totalUnpaid: 0
  },
  {
    id: "n-3",
    name: "Sadie Adler",
    address: "Block C No. 08",
    joinDate: new Date().toISOString(),
    lastReadingDate: new Date().toISOString(),
    lastReadingVolume: 25.0,
    totalUnpaid: 35.00
  }
];

const DEFAULT_READINGS: Reading[] = [
  {
    id: "r-1",
    neighborId: "n-1",
    volume: 18.5,
    totalCost: 22.75,
    isPaid: false,
    date: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: "r-2",
    neighborId: "n-2",
    volume: 12.0,
    totalCost: 13.00,
    isPaid: true,
    date: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: "r-3",
    neighborId: "n-3",
    volume: 25.0,
    totalCost: 35.00,
    isPaid: false,
    date: new Date(Date.now() - 86400000 * 1).toISOString()
  }
];

export function useWaterSystem() {
  const [neighbors, setNeighbors] = useState<Neighbor[]>([]);
  const [readings, setReadings] = useState<Reading[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load initial data with sanitization
  useEffect(() => {
    try {
      const savedNeighbors = localStorage.getItem(STORAGE_KEY_NEIGHBORS);
      const savedReadings = localStorage.getItem(STORAGE_KEY_READINGS);
      
      let loadedNeighbors: Neighbor[] = [];
      let loadedReadings: Reading[] = [];

      if (savedNeighbors) {
        const parsed = JSON.parse(savedNeighbors);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Sanitize: filter out corrupt records without id or name
          loadedNeighbors = parsed
            .filter((n): n is Neighbor => !!(n && typeof n === 'object' && n.id && typeof n.name === 'string'))
            .map(n => ({
              ...n,
              name: n.name || "Unknown Resident",
              totalUnpaid: typeof n.totalUnpaid === 'number' ? n.totalUnpaid : 0
            }));
        }
      }

      if (savedReadings) {
        const parsed = JSON.parse(savedReadings);
        if (Array.isArray(parsed) && parsed.length > 0) {
          loadedReadings = parsed
            .filter((r): r is any => !!(r && typeof r === 'object' && r.id && r.neighborId))
            .map((r: any) => ({
              id: r.id,
              neighborId: r.neighborId,
              volume: typeof r.volume === 'number' ? r.volume : (typeof r.usage === 'number' ? r.usage : 0),
              totalCost: typeof r.totalCost === 'number' ? r.totalCost : (typeof r.cost === 'number' ? r.cost : 0),
              isPaid: typeof r.isPaid === 'boolean' ? r.isPaid : !!r.paid,
              date: r.date || new Date().toISOString()
            }));
        }
      }

      if (loadedNeighbors.length === 0) {
        setNeighbors(DEFAULT_NEIGHBORS);
      } else {
        setNeighbors(loadedNeighbors);
      }

      if (loadedReadings.length === 0) {
        setReadings(DEFAULT_READINGS);
      } else {
        setReadings(loadedReadings);
      }
    } catch (err) {
      console.error("Error loading water system data from localStorage", err);
      setNeighbors(DEFAULT_NEIGHBORS);
      setReadings(DEFAULT_READINGS);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save when data changes (only after initial load to prevent overwriting with empty array)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY_NEIGHBORS, JSON.stringify(neighbors));
    }
  }, [neighbors, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY_READINGS, JSON.stringify(readings));
    }
  }, [readings, isLoaded]);

  return {
    neighbors,
    setNeighbors,
    readings,
    setReadings,
  };
}
