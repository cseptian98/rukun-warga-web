export type { RoleName, Role, PermissionCode, Permission, User, UserProfile, LoginCredentials, AuthState, AuthContextType } from './auth';
export * from './treasury';
export type { RTUnit, Resident } from '../data/initialResidents';

export interface Neighbor {
  id: string;
  name: string;
  nik?: string;
  rt?: string;
  address?: string;
  phone?: string;
  joinDate?: string;
  lastReadingDate?: string;
  lastReadingVolume?: number;
  totalUnpaid: number;
}

export interface Reading {
  id: string;
  neighborId: string;
  volume: number; // current meter reading in m³
  totalCost: number;
  isPaid: boolean;
  date: string; // ISO string
}
