import { instance } from './axios';

export const getApiHealth = async () => {
  const data = await instance.get('/admin/health');
  return data;
};
