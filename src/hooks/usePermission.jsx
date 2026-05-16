import { useContext } from 'react';
import { MainContext } from '@/context';

export function usePermission() {
  const { state: { user } } = useContext(MainContext);

  const isSuperAdmin = user?.userRoles === 'super_admin';

  const hasPermission = (module) => {
    if (!user) return false;
    if (isSuperAdmin) return true;
    return Array.isArray(user.permissions) && user.permissions.includes(module);
  };

  return { hasPermission, isSuperAdmin, permissions: user?.permissions ?? [] };
}
