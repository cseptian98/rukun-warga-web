import { useState, useEffect } from 'react';
import { Neighbor, Reading } from '@/types';

const STORAGE_KEY_NEIGHBORS = 'water_system_neighbors';
const STORAGE_KEY_READINGS = 'water_system_readings';

export function useWaterSystem() {
  const [neighbors, setNeighbors] = useState<Neighbor[]>([]);
  const [readings, setReadings] = useState<Reading[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load initial data
  useEffect(() => {
    const savedNeighbors = localStorage.getItem(STORAGE_KEY_NEIGHBORS);
    const savedReadings = localStorage.getItem(STORAGE_KEY_READINGS);
    
    if (savedNeighbors) setNeighbors(JSON.parse(savedNeighbors));
    if (savedReadings) setReadings(JSON.parse(savedReadings));
    
    setIsLoaded(true);
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
