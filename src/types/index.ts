export interface Neighbor {
  id: string;
  name: string;
  address?: string;
  lastReadingDate?: string;
  totalUnpaid?: number;
}

export interface Reading {
  id: string;
  neighborId: string;
  usage: number; // in m3
  cost: number;
  paid: boolean;
  date: string; // ISO string
}

// types/index.ts
