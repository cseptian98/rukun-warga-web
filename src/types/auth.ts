export type RoleName = 'admin' | 'treasurer' | 'resident';
export type Role = RoleName;

export type PermissionCode =
  | 'treasury:read'
  | 'treasury:write'
  | 'water:read'
  | 'water:manage'
  | 'announcements:publish';
export type Permission = PermissionCode;

export interface User {
  id: string;
  name: string;
  email?: string;
  username?: string;
  role: RoleName;
  permissions: PermissionCode[];
  avatar?: string;
  unitNumber?: string;
  phone?: string;
}

export type UserProfile = User;

export interface LoginCredentials {
  username?: string;
  email?: string;
  password?: string;
  role?: RoleName;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading?: boolean;
}

export interface AuthContextType extends AuthState {
  login: (credentialsOrRole: LoginCredentials | RoleName) => void;
  logout: () => void;
  switchPersona: (role: RoleName) => void;
  hasPermission: (permission: PermissionCode) => boolean;
  hasRole: (role: RoleName | RoleName[]) => boolean;
}
