import { useQuery } from '@tanstack/react-query';
import { getFxRate } from '@/network/fx';

/**
 * Fetches the current active exchange rate from the backend.
 * Returns null in the body if no rate has been set yet.
 */
export const useFxRate = () => {
    return useQuery({
        queryKey: ['admin-fx-rate'],
        queryFn: getFxRate,
        retry: 1,
        staleTime: 60 * 1000, // 1 minute
    });
};
