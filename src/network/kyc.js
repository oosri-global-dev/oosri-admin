import { instance } from './axios';

export const getKycApplications = async ({ page = 1, limit = 10, status, search } = {}) => {
  const { data } = await instance.get('/admin/kyc', { params: { page, limit, status, search } });
  return data;
};

export const getKycApplication = async (kycId) => {
  const { data } = await instance.get(`/admin/kyc/${kycId}`);
  return data;
};

export const approveKyc = async (kycId) => {
  const { data } = await instance.post(`/admin/kyc/${kycId}/approve`);
  return data;
};

export const rejectKyc = async (kycId, reason) => {
  const { data } = await instance.post(`/admin/kyc/${kycId}/reject`, { reason });
  return data;
};
