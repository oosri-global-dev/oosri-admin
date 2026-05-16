import { useCallback, useContext } from 'react';
import { MainContext } from '@/context';

export function usePermission() {
  const { state: { user } } = useContext(MainContext);

  const isSuperAdmin = user?.userRoles === 'super_admin';

  const hasPermission = useCallback((module) => {
    if (!user?.userRoles) return false;
    if (isSuperAdmin) return true;
    return Array.isArray(user.permissions) && user.permissions.includes(module);
  }, [user, isSuperAdmin]);

  return { hasPermission, isSuperAdmin, permissions: user?.permissions ?? [] };
}
