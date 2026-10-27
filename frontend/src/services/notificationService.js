import api from './api';

export const getAllNotifications = async () => {
  const response = await api.get('/notifications');
  return response.data.data;
};

export const getNotificationsPaged = async (params = {}) => {
  const response = await api.get('/notifications/paged', { params });
  return response.data;
};

export const getUnreadCount = async () => {
  const response = await api.get('/notifications/unread-count');
  return response.data.data.unreadCount;
};

export const markNotificationAsRead = async (id) => {
  const response = await api.patch(`/notifications/${id}/read`);
  return response.data.data;
};

export const markAllNotificationsAsRead = async () => {
  const response = await api.patch('/notifications/read-all');
  return response.data;
};

export const recordEngagement = async (noticeId, engagementType) => {
  const response = await api.post('/notifications/engage', { noticeId, engagementType });
  return response.data;
};
