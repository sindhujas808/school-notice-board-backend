import api from './api';

export const getAnalyticsSummary = async () => {
  const response = await api.get('/analytics/summary');
  return response.data.data;
};

export const getUserEngagementAnalytics = async (startDate, endDate) => {
  const params = {};
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  const response = await api.get('/analytics/engagement', { params });
  return response.data.data;
};

export const getDepartmentPerformance = async (startDate) => {
  const params = {};
  if (startDate) params.startDate = startDate;
  const response = await api.get('/analytics/department', { params });
  return response.data.data;
};

export const getCategoryEngagement = async (startDate, endDate) => {
  const params = {};
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  const response = await api.get('/analytics/category', { params });
  return response.data.data;
};
