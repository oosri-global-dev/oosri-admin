import { instance } from './axios';

export const getDashboardSummary = async () => {
  const data = await instance.get('/admin/dashboard/summary');
  return data;
};
export const getDashboardOverview = async (params) => {
  const data = await instance.get(
    `/admin/dashboard/sales-overview?period=${params}`
  );
  return data;
};
