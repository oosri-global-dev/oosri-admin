import { useQuery } from '@tanstack/react-query';
import { getProduct } from '@/network/product';

export const useProduct = (productId) => {
    return useQuery({
        queryKey: ['product', productId],
        queryFn: () => getProduct(productId),
        enabled: !!productId, 
        config: {
            staleTime: 5 * 60 * 1000, 
            cacheTime: 10 * 60 * 1000,
        },
        });
  };