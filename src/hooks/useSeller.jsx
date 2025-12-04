import { useQuery } from '@tanstack/react-query';
import { getSeller } from '@/network/sellers';

export const useSeller = (sellerId) => {
  return useQuery({
    queryKey: ['seller', sellerId],
    queryFn: () => getSeller(sellerId),
    enabled: !!sellerId,
    config: {
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    },
  });
};
