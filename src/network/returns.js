import { instance } from './axios';

export const getReturns = async ({ skip = 0, limit = 10, status, search } = {}) => {
  const { data } = await instance.get('/admin/returns', {
    params: { skip, limit, status, search },
  });
  return data;
};

export const getReturn = async (id) => {
  const { data } = await instance.get(`/admin/returns/${id}`);
  return data;
};

export const getReturnSettings = async () => {
  const { data } = await instance.get('/admin/returns/settings');
  return data;
};

export const updateReturnSettings = async (payload) => {
  const { data } = await instance.put('/admin/returns/settings', payload);
  return data;
};

export const approveReturn = async (id, payload = {}) => {
  const { data } = await instance.patch(`/admin/returns/${id}/approve`, payload);
  return data;
};

export const rejectReturn = async (id, payload = {}) => {
  const { data } = await instance.patch(`/admin/returns/${id}/reject`, payload);
  return data;
};

export const triggerRefund = async (id) => {
  const { data } = await instance.patch(`/admin/returns/${id}/refund`);
  return data;
};

export const closeReturn = async (id, payload = {}) => {
  const { data } = await instance.patch(`/admin/returns/${id}/close`, payload);
  return data;
};
