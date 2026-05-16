import { instance } from './axios';

export const fetchNotifications = async ({ skip = 0, limit = 20 } = {}) => {
  const { data } = await instance.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/admin/notifications`,
    { params: { skip, limit } }
  );
  return data;
};

export const markNotificationRead = async (id) => {
  const { data } = await instance.patch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/admin/notifications/${id}/read`
  );
  return data;
};

export const markAllNotificationsRead = async () => {
  const { data } = await instance.patch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/admin/notifications/read-all`
  );
  return data;
};

export const deleteNotification = async (id) => {
  const { data } = await instance.delete(
    `${process.env.NEXT_PUBLIC_BASE_URL}/admin/notifications/${id}`
  );
  return data;
};
