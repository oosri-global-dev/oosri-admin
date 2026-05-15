import { useQuery } from '@tanstack/react-query';
import { getBuyer } from '@/network/buyers';

export const useBuyer = (buyerId) => {
  return useQuery({
    queryKey: ['buyer', buyerId],
    queryFn: () => getBuyer(buyerId),
    enabled: !!buyerId,
    staleTime: 5 * 60 * 1000,
  });
};
