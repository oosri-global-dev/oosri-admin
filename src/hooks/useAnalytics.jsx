import {
  getProductAnalytics,
  getSalesAnalytics,
  getTopPurchasedProducts,
} from '@/network/sales';
import { useQuery } from '@tanstack/react-query';
import { getCategories } from '@/network/product';

const fetchAnalyticsData = async (period) => {
  const [productAnalytics, salesAnalytics] = await Promise.all([
    getProductAnalytics(period),
    getSalesAnalytics(),
  ]);
  return { productAnalytics, salesAnalytics };
};

export const useAnalyticsData = (period) => {
  return useQuery({
    queryKey: ['sales-analytics-data', period],
    queryFn: () => fetchAnalyticsData(period),
    cacheTime: 0,
    staleTime: 0,
  });
};

export const useTopPurchasedProducts = (period = '', category = '') => {
  console.log(period, category, 'THIS IS COMING FOR HOOKS');
  return useQuery({
    queryKey: ['top-purchased-products', period, category],
    queryFn: () => getTopPurchasedProducts(period, category),
    staleTime: 0,
    cacheTime: 0,
    // enabled: !!period || !!category,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await getCategories();
      return res?.data?.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};
