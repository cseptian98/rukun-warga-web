import { useState, useEffect } from 'react';
import { Neighbor, Reading } from '@/types';
import { INITIAL_RESIDENTS } from '@/data/initialResidents';
import { calculateWaterCost } from '@/utils/billing';

const STORAGE_KEY_NEIGHBORS = 'water_system_neighbors';
const STORAGE_KEY_READINGS = 'water_system_readings_v2';
const RESIDENTS_STORAGE_KEY = 'ksm_resident_directory';
const RESIDENTS_SYNC_EVENT = 'ksm_residents_updated';

// 18 Initial dummy readings: exactly 3 of each RT (RT 01 through RT 06)
export const DEFAULT_READINGS: Reading[] = [
  // RT 01
  {
    id: "r-01-1",
    neighborId: "res-001",
    volume: 18.5,
    totalCost: calculateWaterCost(18.5), // Rp 54.750
    isPaid: false,
    date: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: "r-01-2",
    neighborId: "res-002",
    volume: 12.0,
    totalCost: calculateWaterCost(12.0), // Rp 32.000
    isPaid: true,
    date: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: "r-01-3",
    neighborId: "res-003",
    volume: 24.0,
    totalCost: calculateWaterCost(24.0), // Rp 80.000
    isPaid: false,
    date: new Date(Date.now() - 86400000 * 1).toISOString()
  },

  // RT 02
  {
    id: "r-02-1",
    neighborId: "res-016",
    volume: 15.0,
    totalCost: calculateWaterCost(15.0), // Rp 42.500
    isPaid: true,
    date: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: "r-02-2",
    neighborId: "res-017",
    volume: 8.0,
    totalCost: calculateWaterCost(8.0), // Rp 20.000
    isPaid: false,
    date: new Date(Date.now() - 86400000 * 4).toISOString()
  },
  {
    id: "r-02-3",
    neighborId: "res-018",
    volume: 21.5,
    totalCost: calculateWaterCost(21.5), // Rp 67.500
    isPaid: true,
    date: new Date(Date.now() - 86400000 * 6).toISOString()
  },

  // RT 03
  {
    id: "r-03-1",
    neighborId: "res-031",
    volume: 14.0,
    totalCost: calculateWaterCost(14.0), // Rp 39.000
    isPaid: false,
    date: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: "r-03-2",
    neighborId: "res-032",
    volume: 9.5,
    totalCost: calculateWaterCost(9.5), // Rp 23.750
    isPaid: true,
    date: new Date(Date.now() - 86400000 * 7).toISOString()
  },
  {
    id: "r-03-3",
    neighborId: "res-033",
    volume: 26.0,
    totalCost: calculateWaterCost(26.0), // Rp 90.000
    isPaid: false,
    date: new Date(Date.now() - 86400000 * 3).toISOString()
  },

  // RT 04
  {
    id: "r-04-1",
    neighborId: "res-046",
    volume: 16.5,
    totalCost: calculateWaterCost(16.5), // Rp 47.750
    isPaid: true,
    date: new Date(Date.now() - 86400000 * 4).toISOString()
  },
  {
    id: "r-04-2",
    neighborId: "res-047",
    volume: 11.0,
    totalCost: calculateWaterCost(11.0), // Rp 28.500
    isPaid: false,
    date: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: "r-04-3",
    neighborId: "res-048",
    volume: 7.5,
    totalCost: calculateWaterCost(7.5), // Rp 18.750
    isPaid: true,
    date: new Date(Date.now() - 86400000 * 5).toISOString()
  },

  // RT 05
  {
    id: "r-05-1",
    neighborId: "res-061",
    volume: 20.0,
    totalCost: calculateWaterCost(20.0), // Rp 60.000
    isPaid: false,
    date: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: "r-05-2",
    neighborId: "res-062",
    volume: 13.5,
    totalCost: calculateWaterCost(13.5), // Rp 37.250
    isPaid: true,
    date: new Date(Date.now() - 86400000 * 8).toISOString()
  },
  {
    id: "r-05-3",
    neighborId: "res-063",
    volume: 10.0,
    totalCost: calculateWaterCost(10.0), // Rp 25.000
    isPaid: true,
    date: new Date(Date.now() - 86400000 * 6).toISOString()
  },

  // RT 06
  {
    id: "r-06-1",
    neighborId: "res-076",
    volume: 22.0,
    totalCost: calculateWaterCost(22.0), // Rp 70.000
    isPaid: false,
    date: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: "r-06-2",
    neighborId: "res-077",
    volume: 17.0,
    totalCost: calculateWaterCost(17.0), // Rp 49.500
    isPaid: true,
    date: new Date(Date.now() - 86400000 * 4).toISOString()
  },
  {
    id: "r-06-3",
    neighborId: "res-078",
    volume: 12.5,
    totalCost: calculateWaterCost(12.5), // Rp 33.750
    isPaid: false,
    date: new Date(Date.now() - 86400000 * 1).toISOString()
  }
];

// Map initial metrics from DEFAULT_READINGS
const initialMetricsMap = new Map<string, { lastReadingDate: string; lastReadingVolume: number; totalUnpaid: number }>();
DEFAULT_READINGS.forEach(r => {
  initialMetricsMap.set(r.neighborId, {
    lastReadingDate: r.date,
    lastReadingVolume: r.volume,
    totalUnpaid: r.isPaid ? 0 : r.totalCost
  });
});

const DEFAULT_NEIGHBORS: Neighbor[] = INITIAL_RESIDENTS.map((res) => {
  const metric = initialMetricsMap.get(res.id);
  return {
    id: res.id,
    name: res.name,
    rt: res.rt,
    nik: res.nik,
    phone: res.phone,
    address: res.address,
    joinDate: res.joinDate,
    lastReadingDate: metric?.lastReadingDate,
    lastReadingVolume: metric?.lastReadingVolume,
    totalUnpaid: metric?.totalUnpaid || 0,
  };
});

export function useWaterSystem() {
  const [neighbors, setNeighbors] = useState<Neighbor[]>([]);
  const [readings, setReadings] = useState<Reading[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load initial data with master resident directory reconciliation and sanitization
  useEffect(() => {
    try {
      // 1. Seed or load master resident directory
      let masterResidents: any[] = [];
      const storedResidents = localStorage.getItem(RESIDENTS_STORAGE_KEY);
      if (storedResidents) {
        try {
          const parsed = JSON.parse(storedResidents);
          if (Array.isArray(parsed) && parsed.length > 0) {
            masterResidents = parsed.filter((r: any) => !!(r && typeof r === 'object' && r.id));
          }
        } catch (e) {
          console.error("Failed to parse ksm_resident_directory", e);
        }
      }

      if (masterResidents.length === 0) {
        masterResidents = INITIAL_RESIDENTS;
        try {
          localStorage.setItem(RESIDENTS_STORAGE_KEY, JSON.stringify(INITIAL_RESIDENTS));
        } catch (e) {
          console.error("Failed to seed initial residents in localStorage", e);
        }
      }

      // 2. Load stored readings or fallback to defaults (migrating from old key if needed)
      let loadedReadings: Reading[] = [];
      const savedReadings = localStorage.getItem(STORAGE_KEY_READINGS);
      if (savedReadings) {
        try {
          const parsed = JSON.parse(savedReadings);
          if (Array.isArray(parsed) && parsed.length > 0) {
            loadedReadings = parsed
              .filter((r): r is any => !!(r && typeof r === 'object' && r.id && r.neighborId))
              .map((r: any) => ({
                id: r.id,
                neighborId: r.neighborId,
                volume: typeof r.volume === 'number' ? r.volume : 0,
                totalCost: typeof r.totalCost === 'number' ? r.totalCost : 0,
                isPaid: typeof r.isPaid === 'boolean' ? r.isPaid : !!r.paid,
                date: r.date || new Date().toISOString()
              }));
          }
        } catch (e) {
          console.error("Failed to parse saved readings", e);
        }
      }

      // If empty or fewer than 18 records (old 3-record dummy), initialize with 18 dummy records across 6 RTs
      if (loadedReadings.length < 18) {
        loadedReadings = DEFAULT_READINGS;
        localStorage.setItem(STORAGE_KEY_READINGS, JSON.stringify(DEFAULT_READINGS));
      }
      setReadings(loadedReadings);

      // 3. Load saved water system neighbor metrics (last reading, total unpaid)
      const metricsMap = new Map<string, { lastReadingDate?: string; lastReadingVolume?: number; totalUnpaid?: number }>();
      const savedNeighbors = localStorage.getItem(STORAGE_KEY_NEIGHBORS);
      if (savedNeighbors) {
        try {
          const parsed = JSON.parse(savedNeighbors);
          if (Array.isArray(parsed) && parsed.length >= 18) {
            parsed.forEach((n: any) => {
              if (n && n.id) {
                metricsMap.set(n.id, {
                  lastReadingDate: n.lastReadingDate,
                  lastReadingVolume: typeof n.lastReadingVolume === 'number' ? n.lastReadingVolume : undefined,
                  totalUnpaid: typeof n.totalUnpaid === 'number' ? n.totalUnpaid : 0
                });
              }
            });
          }
        } catch (e) {
          console.error("Failed to parse saved neighbors", e);
        }
      }

      // Reconcile neighbors strictly from master directory and readings
      const reconciledNeighbors: Neighbor[] = masterResidents.map((res: any) => {
        // Find metrics from saved neighbors, or default metrics, or calculated from loadedReadings
        const existingMetric = metricsMap.get(res.id);
        const defaultMetric = initialMetricsMap.get(res.id);

        // Calculate latest reading for this resident from loadedReadings
        const resReadings = loadedReadings.filter(r => r.neighborId === res.id);
        const latestReading = resReadings.length > 0
          ? [...resReadings].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
          : undefined;

        const unpaidTotal = resReadings.filter(r => !r.isPaid).reduce((sum, r) => sum + r.totalCost, 0);

        return {
          id: res.id,
          name: res.name || "Unknown Resident",
          rt: res.rt || "RT 01",
          nik: res.nik || "",
          phone: res.phone || "",
          address: res.address || "",
          joinDate: res.joinDate || new Date().toISOString().split('T')[0],
          lastReadingDate: latestReading?.date || existingMetric?.lastReadingDate || defaultMetric?.lastReadingDate,
          lastReadingVolume: latestReading?.volume ?? existingMetric?.lastReadingVolume ?? defaultMetric?.lastReadingVolume,
          totalUnpaid: unpaidTotal,
        };
      });

      setNeighbors(reconciledNeighbors);
    } catch (err) {
      console.error("Error loading water system data", err);
      setNeighbors(DEFAULT_NEIGHBORS);
      setReadings(DEFAULT_READINGS);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Listen for both ksm_residents_updated and storage events to sync with master resident directory in real-time
  useEffect(() => {
    const handleResidentsSync = () => {
      try {
        const storedResidents = localStorage.getItem(RESIDENTS_STORAGE_KEY);
        if (storedResidents) {
          const parsed = JSON.parse(storedResidents);
          if (Array.isArray(parsed)) {
            const validResidents = parsed.filter((r: any) => !!(r && typeof r === 'object' && r.id));
            setNeighbors((prevNeighbors) => {
              const prevMap = new Map<string, Neighbor>(prevNeighbors.map(n => [n.id, n]));
              return validResidents.map((res: any) => {
                const existing = prevMap.get(res.id);
                return {
                  id: res.id,
                  name: res.name || "Unknown Resident",
                  rt: res.rt || existing?.rt || "RT 01",
                  nik: res.nik ?? existing?.nik ?? "",
                  phone: res.phone ?? existing?.phone ?? "",
                  address: res.address ?? existing?.address ?? "",
                  joinDate: res.joinDate || existing?.joinDate,
                  lastReadingDate: existing?.lastReadingDate,
                  lastReadingVolume: existing?.lastReadingVolume,
                  totalUnpaid: existing?.totalUnpaid ?? 0,
                };
              });
            });
          }
        }
      } catch (err) {
        console.error('Error syncing residents in useWaterSystem:', err);
      }
    };

    window.addEventListener(RESIDENTS_SYNC_EVENT, handleResidentsSync);
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === RESIDENTS_STORAGE_KEY) {
        handleResidentsSync();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener(RESIDENTS_SYNC_EVENT, handleResidentsSync);
      window.removeEventListener('storage', handleStorageChange);
    };
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
