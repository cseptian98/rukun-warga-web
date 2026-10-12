import React, { useEffect, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { usePermission } from '@/hooks/usePermission';
import { PermissionCode, RoleName } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: RoleName | RoleName[];
  requiredPermission?: PermissionCode;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  requiredRole,
  requiredPermission,
  redirectTo = '/',
}: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth();
  const { hasPermission, hasRole } = usePermission();

  const isAllowed = useMemo(() => {
    if (!isAuthenticated || !user) return false;
    if (requiredRole && !hasRole(requiredRole)) return false;
    if (requiredPermission && !hasPermission(requiredPermission)) return false;
    return true;
  }, [isAuthenticated, user, requiredRole, requiredPermission, hasRole, hasPermission]);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Akses Ditolak: Silakan login terlebih dahulu.', {
        id: 'auth-denied',
      });
    } else if (!isAllowed) {
      toast.error(
        `Akses Ditolak: Akun (${user?.role}) tidak memiliki izin yang diperlukan.`,
        { id: 'permission-denied' }
      );
    }
  }, [isAuthenticated, isAllowed, user]);

  if (!isAllowed) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
