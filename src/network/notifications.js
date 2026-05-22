import { instance } from './axios';

export const fetchNotifications = async ({ page = 1, limit = 20 } = {}) => {
  const { data } = await instance.get('/admin/notifications', { params: { page, limit } });
  return data;
};

export const markNotificationRead = async (id) => {
  const { data } = await instance.patch(`/admin/notifications/${id}/read`);
  return data;
};

export const markAllNotificationsRead = async () => {
  const { data } = await instance.patch('/admin/notifications/read-all');
  return data;
};

export const deleteNotification = async (id) => {
  const { data } = await instance.delete(`/admin/notifications/${id}`);
  return data;
};
