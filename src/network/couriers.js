import { instance, formInstance } from './axios';

export const getCouriers = async () => {
  const { data } = await instance.get('/admin/courier-services');
  return data;
};

export const createCourier = async (formData) => {
  const { data } = await formInstance.post('/admin/courier-services', formData);
  return data;
};

export const deleteCourier = async (courierId) => {
  const { data } = await instance.delete(`/admin/courier-services/${courierId}`);
  return data;
};
