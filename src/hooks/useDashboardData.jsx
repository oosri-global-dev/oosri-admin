import { useQuery } from '@tanstack/react-query';
import { getDashboardOverview, getDashboardSummary } from '@/network/dashboard';

const fetchDashboardData = async (period) => {
  const [overview, summary] = await Promise.all([
       getDashboardSummary(),
    getDashboardOverview(period),
  ]);
  return { overview, summary };
};

export const useDashboardData = (period = 'month') => {
  return useQuery({
    queryKey: ['dashboard-data', period],
    queryFn: () => fetchDashboardData(period),
  });
};