import { useQuery } from '@tanstack/react-query';
import { getBuyers } from '@/network/buyers';

export const useBuyers = (page = 1, searchTerm = '') => {
  return useQuery({
    queryKey: ['buyers', page, searchTerm],
    queryFn: () => getBuyers(page, searchTerm),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 2,
  });
};
