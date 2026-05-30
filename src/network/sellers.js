import { instance } from './axios';

export const getSellers = async (page = 1, limit = 10) => {
  try {
    const data = await instance.get(`/admin/sellers?page=${page}&limit=${limit}`);
    return data;
  } catch (error) {
    console.error('Error fetching sellers:', error);
    throw error;
  }
};

export const searchSeller = async (value) => {
  try {
    const data = await instance.get(`/admin/sellers?searchTerm=${value}`);
    return data;
  } catch (error) {
    console.error('Error searching sellers:', error);
    throw error;
  }
};

export const getSeller = async (sellerId) => {
  try {
    const data = await instance.get(`/admin/sellers/${sellerId}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteSeller = async (sellerId) => {
  const { data } = await instance.delete(`/admin/sellers/${sellerId}`);
  return data;
};

export const suspendSeller = async (sellerId, reason) => {
  const { data } = await instance.patch(`/admin/sellers/${sellerId}/suspend`, { reason });
  return data;
};

export const unsuspendSeller = async (sellerId) => {
  const { data } = await instance.patch(`/admin/sellers/${sellerId}/unsuspend`);
  return data;
};
