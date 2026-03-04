import { useMutation, useQueryClient } from '@tanstack/react-query';
import { setFxRate } from '@/network/fx';

/**
 * Mutation hook to set the NGN/USD exchange rate.
 * On success, invalidates the cached rate so the UI reflects
 * the new value immediately.
 */
export const useSetFxRate = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ usdToNgnRate, note }) => setFxRate({ usdToNgnRate, note }),
        onSuccess: () => {
            // Refresh the displayed rate after a successful update
            queryClient.invalidateQueries({ queryKey: ['admin-fx-rate'] });
        },
    });
};
