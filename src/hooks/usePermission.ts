import { useAuth } from './useAuth';
import { PermissionCode, RoleName } from '@/types';

export function usePermission() {
  const { user } = useAuth();

  const hasPermission = (permission: PermissionCode): boolean => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    return user.permissions.includes(permission);
  };

  const hasRole = (role: RoleName | RoleName[]): boolean => {
    if (!user) return false;
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    return user.role === role;
  };

  const can = (permission: PermissionCode): boolean => {
    return hasPermission(permission);
  };

  const isAdmin = user?.role === 'admin';
  const isTreasurer = user?.role === 'treasurer';
  const isResident = user?.role === 'resident';

  return {
    hasPermission,
    hasRole,
    can,
    isAdmin,
    isTreasurer,
    isResident,
  };
}
