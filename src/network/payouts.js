import { instance } from './axios';

export const getPayouts = async (page = 1, status = '') => {
  const params = new URLSearchParams({ page, limit: 20 });
  if (status) params.set('status', status);
  const data = await instance.get(`/admin/payouts?${params}`);
  return data;
};

export const approvePayout = async (payoutId) => {
  const data = await instance.patch(`/admin/payouts/${payoutId}/approve`);
  return data;
};

export const rejectPayout = async (payoutId) => {
  const data = await instance.patch(`/admin/payouts/${payoutId}/reject`);
  return data;
};
