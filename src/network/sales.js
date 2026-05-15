import { instance } from './axios';

export const getSalesAnalytics = async () => {
  try {
    const data = await instance.get('/admin/analytics/sales');
    return data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message || 'Unknown error');
  }
};

export const getProductAnalytics = async (period) => {
  try {
    const data = await instance.get(`/admin/analytics/products?dateFilter=${period}`);
    return data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message || 'Unknown error');
  }
};

export const getTopPurchasedProducts = async (period = 'thisWeek', category = '') => {
  try {
    const params = new URLSearchParams({ dateFilter: period });
    if (category && typeof category === 'string') params.set('category', category);
    const response = await instance.get(
      `/admin/analytics/top-purchase-products?${params.toString()}`
    );
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message || 'Unknown error');
  }
};
