import api from './api';

export const login = async (username, password) => {
  const response = await api.post('/auth/login', { username, password });
  if (response.data && response.data.data) {
    localStorage.setItem('user', JSON.stringify(response.data.data));
  }
  return response.data.data;
};

export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data.data;
};

export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (e) {
    // Ignore logout network errors
  }
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  }
  return null;
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data.data;
};
