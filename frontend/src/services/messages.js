import api from './api';

export const getMessages = async () => {
  const response = await api.get('/messages');
  return response.data.data;
};

export const getUnreadMessages = async () => {
  const response = await api.get('/messages/unread');
  return response.data.data;
};

export const markMessageAsRead = async (messageId) => {
  const response = await api.patch(`/messages/${messageId}/read`);
  return response.data;
};

export const sendMessage = async (messageData) => {
  const response = await api.post('/messages', messageData);
  return response.data;
};

export const deleteMessage = async (messageId) => {
  const response = await api.delete(`/messages/${messageId}`);
  return response.data;
};