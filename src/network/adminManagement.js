import { instance } from './axios';

export const fetchAdmins = async () => {
  const { data } = await instance.get(`${process.env.NEXT_PUBLIC_BASE_URL}/admin/admins`);
  return data;
};

export const createAdmin = async (payload) => {
  const { data } = await instance.post(`${process.env.NEXT_PUBLIC_BASE_URL}/admin/admins`, payload);
  return data;
};

export const updateAdmin = async (id, payload) => {
  const { data } = await instance.put(`${process.env.NEXT_PUBLIC_BASE_URL}/admin/admins/${id}`, payload);
  return data;
};

export const deleteAdmin = async (id) => {
  const { data } = await instance.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/admin/admins/${id}`);
  return data;
};
