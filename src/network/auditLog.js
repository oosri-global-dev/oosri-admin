import { instance } from './axios';

export const getAuditLogs = async (params = {}) => {
  const { data } = await instance.get('/admin/audit-logs', { params });
  return data;
};
