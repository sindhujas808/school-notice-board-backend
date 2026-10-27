import api from './api';

export const getCommentsByNoticeId = async (noticeId) => {
  const response = await api.get(`/notices/${noticeId}/comments`);
  return response.data.data;
};

export const addComment = async (noticeId, content) => {
  const response = await api.post(`/notices/${noticeId}/comments`, { content });
  return response.data.data;
};

export const deleteComment = async (commentId) => {
  const response = await api.delete(`/comments/${commentId}`);
  return response.data;
};
