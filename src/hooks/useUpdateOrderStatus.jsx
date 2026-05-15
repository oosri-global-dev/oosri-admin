import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateOrderStatus } from '@/network/order';

/**
 * Mutation hook to update an order's status from the admin dashboard.
 * On success, invalidates the cached order query so the UI reflects
 * the new status immediately without a manual page refresh.
 */
export const useUpdateOrderStatus = (orderId) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (newStatus) => updateOrderStatus(orderId, newStatus),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['order', orderId] });
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        },
    });
};
