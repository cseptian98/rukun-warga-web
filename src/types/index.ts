export type { RoleName, Role, PermissionCode, Permission, User, UserProfile, LoginCredentials, AuthState } from './auth';
export interface AuthContextType {
  user: import('./auth').User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (role: import('./auth').RoleName) => void;
  logout: () => void;
  switchPersona: (role: import('./auth').RoleName) => void;
  hasPermission?: (permission: import('./auth').PermissionCode) => boolean;
  hasRole?: (role: import('./auth').RoleName | import('./auth').RoleName[]) => boolean;
}
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
