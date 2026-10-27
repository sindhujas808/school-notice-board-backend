import api from './api';

export const getAllNotices = async (params = {}) => {
  const response = await api.get('/notices', { params });
  return response.data;
};

export const getPublicNotices = async (params = {}) => {
  const response = await api.get('/notices/public', { params });
  return response.data;
};

export const getNoticeById = async (id) => {
  const response = await api.get(`/notices/${id}`);
  return response.data.data;
};

export const addNotice = async (noticeData) => {
  const response = await api.post('/notices', noticeData);
  return response.data.data;
};

export const updateNotice = async (id, noticeData) => {
  const response = await api.put(`/notices/${id}`, noticeData);
  return response.data.data;
};

export const deleteNotice = async (id) => {
  const response = await api.delete(`/notices/${id}`);
  return response.data;
};

export const publishNotice = async (id) => {
  const response = await api.patch(`/notices/${id}/publish`);
  return response.data.data;
};

export const searchNotices = async (params = {}) => {
  const response = await api.get('/notices/search', { params });
  return response.data;
};

export const uploadAttachment = async (noticeId, file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post(`/files/upload/${noticeId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.data;
};
