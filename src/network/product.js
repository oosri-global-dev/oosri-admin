import { formInstance, instance } from './axios';

export const getAllProducts = async () => {
  const data = await instance.get('/products/admin');
  return data;
};

export const filterProducts = async (params = {}) => {
  const { data } = await instance.get('/products/admin/filter', {
    params: {
      ...params,
      page: params.page || 1,
      limit: params.limit || 10,
    },
  });
  return data;
};

export const getProduct = async (productId) => {
  const data = await instance.get(`/products/admin/${productId}`);
  return data;
};

export const getCategories = async () => {
  const data = await instance.get(`/categories`);
  return data;
};

export const deleteProduct = async (params) => {
  const data = await instance.delete(`/products/admin/${params}`);
  return data;
};

export const createProduct = async (payload) => {
  const data = await formInstance.post(`/products/admin/add`, payload);
  return data;
};

export const editProduct = async (params, payload) => {
  const { data } = await instance.put(`/products/admin/${params}`, payload);
  return data;
};
export const toggleProductVisibility = async (id, payload) => {
  const { data } = await instance.patch(`products/admin/${id}/visibility`, payload);
  return data;
};
