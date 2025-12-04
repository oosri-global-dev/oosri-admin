import { instance } from './axios';

export const getSellers = async () => {
  try {
    const data = await instance.get('/admin/sellers');
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
