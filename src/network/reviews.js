import { instance } from './axios';

export const getReviews = async ({ status, page = 1, limit = 20 } = {}) => {
  const { data } = await instance.get('/admin/reviews', {
    params: { status, page, limit },
  });
  return data;
};

export const moderateReview = async (id, status) => {
  const { data } = await instance.patch(`/admin/reviews/${id}/moderate`, { status });
  return data;
};

export const deleteReview = async (id) => {
  const { data } = await instance.delete(`/admin/reviews/${id}`);
  return data;
};
