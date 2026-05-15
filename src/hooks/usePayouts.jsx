import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPayouts, approvePayout, rejectPayout } from '@/network/payouts';

export const usePayouts = (page = 1, status = '') => {
  return useQuery({
    queryKey: ['payouts', page, status],
    queryFn: () => getPayouts(page, status),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 2,
  });
};

export const useApprovePayout = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payoutId) => approvePayout(payoutId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['payouts'] }),
  });
};

export const useRejectPayout = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payoutId) => rejectPayout(payoutId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['payouts'] }),
  });
};
