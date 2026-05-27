import { useQuery } from '@tanstack/react-query';
import { getDashboardOverview, getDashboardSummary } from '@/network/dashboard';

export const useDashboardSummary = () =>
  useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: getDashboardSummary,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

export const useDashboardOverview = (period = 'monthly') =>
  useQuery({
    queryKey: ['dashboard-overview', period],
    queryFn: () => getDashboardOverview(period),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

// Kept for any other consumers that import the old default export
export const useDashboardData = (period = 'monthly') => {
  const summary  = useDashboardSummary();
  const overview = useDashboardOverview(period);
  return {
    data: {
      overview: overview.data,
      summary:  summary.data,
    },
    isLoading: summary.isLoading || overview.isLoading,
    isError:   summary.isError   || overview.isError,
  };
};
