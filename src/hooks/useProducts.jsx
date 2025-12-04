import { useQuery } from '@tanstack/react-query';
import { getAllProducts, filterProducts } from '@/network/product';

export const useProducts = (filters) => {
  const shouldFilter = filters && Object.values(filters).some(val => val !== undefined);
  
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => shouldFilter ? filterProducts(filters) : getAllProducts(),
    keepPreviousData: true,  
    staleTime: 5 * 60 * 1000, 
  });
};