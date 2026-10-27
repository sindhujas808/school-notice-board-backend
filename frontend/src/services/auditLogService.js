import api from './api';

export const getAllAuditLogs = async (page = 0, size = 20) => {
  const response = await api.get('/audit-logs', { params: { page, size } });
  return response.data;
};

export const getRecentAuditLogs = async () => {
  const response = await api.get('/audit-logs/recent');
  return response.data.data;
};
