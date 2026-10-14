export type { RoleName, Role, PermissionCode, Permission, User, UserProfile, LoginCredentials, AuthState, AuthContextType } from './auth';
export * from './treasury';

export interface Neighbor {
  id: string;
  name: string;
  address?: string;
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
