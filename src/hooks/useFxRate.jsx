import { useQuery } from '@tanstack/react-query';
import { getFxRate } from '@/network/fx';

/**
 * Fetches the current active exchange rate from the backend.
 * Returns { body: null } when no rate has been set yet (200 response).
 * retry: false — we don't retry on auth errors.
 */
export const useFxRate = () => {
    return useQuery({
        queryKey: ['admin-fx-rate'],
        queryFn: getFxRate,
        retry: false,  // don't retry — if it errors it errors
        staleTime: 60 * 1000, // 1 minute
    });
};
