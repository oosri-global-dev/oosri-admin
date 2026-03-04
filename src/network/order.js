import { instance } from './axios';
export const getOrders = async (params = {}) => {
  const { data } = await instance.get('/admin/order/all', {
    params: {
      ...params,
      skip: params.skip || 0,
      limit: params.limit || 10,
    },
  });
  return data;
};

export const searchOrders = async ({ searchTerm }) => {
  const { data } = await instance.get('/admin/order/search', {
    params: { searchTerm: searchTerm },
  });
  return data;
};

export const getOrder = async (orderId) => {
  if (!orderId) return null;
  console.log('ORDER ID', orderId);
  const data = await instance.get(`/admin/order/${orderId}`);
  console.log('ORDER DATA', data);
  return data;
};

export const updateOrderStatus = async (orderId, orderStatus) => {
  const { data } = await instance.patch(`/admin/order/${orderId}/status`, {
    orderStatus,
  });
  return data;
};
