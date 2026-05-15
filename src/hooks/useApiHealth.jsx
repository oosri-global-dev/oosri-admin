import { useQuery } from '@tanstack/react-query';
import { getApiHealth } from '@/network/health';

export const useApiHealth = () => {
  return useQuery({
    queryKey: ['api-health'],
    queryFn: async () => {
      const res = await getApiHealth();
      return res?.data?.body || {};
    },
    refetchInterval: 60 * 1000,
    staleTime: 30 * 1000,
  });
};
