import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSettings, updateSettings, testShippingProvider } from '@/network/settings';

export const useSettings = () => {
  return useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      const res = await getSettings();
      return res?.data?.body || {};
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateSettings = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => updateSettings(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-settings'] }),
  });
};

export const useTestShippingProvider = () => {
  return useMutation({
    mutationFn: (provider) => testShippingProvider(provider),
  });
};
