import { useQuery } from '@tanstack/react-query';
import { getOrders, searchOrders } from '@/network/order';

export const useOrders = (params = {}, searchTerm = '') => {
  const shouldSearch = searchTerm.trim() !== '';

  return useQuery({
    queryKey: shouldSearch
      ? ['orders', 'search', searchTerm]
      : ['orders', 'list', params],
    queryFn: () =>
      shouldSearch ? searchOrders({ searchTerm }) : getOrders(params),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
  });
};
