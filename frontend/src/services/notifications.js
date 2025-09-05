import api from "./api";

// Obtener todas las notificaciones del usuario
export const getNotifications = async () => {
  const response = await api.get("/notifications");
  return response.data.notifications;
};

// Obtener notificaciones no leídas del usuario
export const getUnreadNotifications = async () => {
  const response = await api.get("/notifications/unread");
  return response.data.notifications;
};

// Marcar una notificación como leída
export const markAsRead = async (notificationId) => {
  const response = await api.patch(`/notifications/${notificationId}/read`);
  return response.data;
};

// Marcar todas las notificaciones como leídas
export const markAllAsRead = async () => {
  const response = await api.patch("/notifications/read-all");
  return response.data;
};

// Eliminar una notificación
export const deleteNotification = async (notificationId) => {
  const response = await api.delete(`/notifications/${notificationId}`);
  return response.data;
};

// Eliminar todas las notificaciones
export const deleteAllNotifications = async () => {
  const response = await api.delete("/notifications/delete-all");
  return response.data;
};
