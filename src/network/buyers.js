import { instance } from './axios';

export const getBuyers = async (page = 1, searchTerm = '') => {
  const params = new URLSearchParams({ page, limit: 20 });
  if (searchTerm.trim()) params.set('searchTerm', searchTerm.trim());
  const data = await instance.get(`/admin/buyers?${params}`);
  return data;
};

export const getBuyer = async (buyerId) => {
  const data = await instance.get(`/admin/buyers/${buyerId}`);
  return data;
};

export const suspendBuyer = async (buyerId, reason) => {
  const data = await instance.patch(`/admin/buyers/${buyerId}/suspend`, { reason });
  return data;
};

export const unsuspendBuyer = async (buyerId) => {
  const data = await instance.patch(`/admin/buyers/${buyerId}/unsuspend`);
  return data;
};
