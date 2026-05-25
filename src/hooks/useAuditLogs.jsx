import { useQuery } from '@tanstack/react-query';
import { getAuditLogs } from '@/network/auditLog';

export const useAuditLogs = (params = {}) => {
  return useQuery({
    queryKey: ['audit-logs', params],
    queryFn: () => getAuditLogs(params),
    keepPreviousData: true,
    staleTime: 60 * 1000,
  });
};
