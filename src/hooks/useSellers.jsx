import { getSellers, searchSeller } from '@/network/sellers';
import { useQuery } from '@tanstack/react-query';

export const useSellers = (searchTerm = '', options = {}) => {
  const { shouldGetAllSellers = true } = options;

  return useQuery({
    queryKey: ['sellers', searchTerm, shouldGetAllSellers],
    queryFn: async () => {
      const shouldSearch = searchTerm.trim() !== '';

      // If searching, use searchSeller
      if (shouldSearch) {
        const res = await searchSeller(searchTerm);
        return { sellers: res?.data?.body?.sellers || [] };
      }

      // If shouldGetAllSellers is true, paginate and gather all sellers
      if (shouldGetAllSellers) {
        let allSellers = [];
        let currentPage = 1;
        let totalPages = 1;

        do {
          const res = await getSellers(currentPage);
          console.log('SELLERS RESPONSE', res.data?.body?.sellers);
          const sellers = res.data?.body?.sellers || [];
          const meta = res.data.meta || {};

          allSellers.push(...sellers);
          totalPages = meta.totalPages || 1;
          currentPage++;
        } while (currentPage <= totalPages);

        return { sellers: allSellers };
      }

      // Otherwise, just get the first page
      const res = await getSellers(1);
      return { sellers: res.data.sellers || [] };
    },
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });
};
