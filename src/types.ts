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

export const BILLING_TIERS = [
  { max: 10, rate: 1.00 },
  { max: 20, rate: 1.50 },
  { max: Infinity, rate: 2.00 },
];
