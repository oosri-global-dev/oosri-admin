import { instance } from './axios';

export const getSettings = async () => {
  const data = await instance.get('/admin/settings');
  return data;
};

export const updateSettings = async (payload) => {
  const data = await instance.put('/admin/settings', payload);
  return data;
};

export const testShippingProvider = async (provider) => {
  const data = await instance.post(`/admin/settings/shipping/test`, { provider });
  return data;
};
