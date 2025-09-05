import { useState, useEffect } from "react";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
} from "../../services/notifications";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'unread', 'read'

  // Cargar todas las notificaciones
  const fetchNotifications = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error("Error al cargar notificaciones:", err);
      setError("No se pudieron cargar las notificaciones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Marcar una notificación como leída
  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
      // Actualizar el estado local
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, is_read: 1 }
            : notification
        )
      );
    } catch (err) {
      console.error("Error al marcar notificación como leída:", err);
    }
  };

  // Marcar todas las notificaciones como leídas
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      // Actualizar el estado local
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, is_read: 1 }))
      );
    } catch (err) {
      console.error(
        "Error al marcar todas las notificaciones como leídas:",
        err
      );
    }
  };

  // Eliminar una notificación
  const handleDeleteNotification = async (notificationId) => {
    try {
      await deleteNotification(notificationId);
      // Actualizar el estado local
      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== notificationId)
      );
    } catch (err) {
      console.error("Error al eliminar notificación:", err);
    }
  };

  // Eliminar todas las notificaciones
  const handleDeleteAllNotifications = async () => {
    try {
      await deleteAllNotifications();
      setNotifications([]);
    } catch (err) {
      console.error("Error al eliminar todas las notificaciones:", err);
    }
  };

  // Formatear la fecha de la notificación
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Filtrar notificaciones según la pestaña activa
  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return notification.is_read === 0;
    if (activeTab === "read") return notification.is_read === 1;
    return true;
  });

  // Determinar el icono según el tipo de notificación
  const getNotificationIcon = (type) => {
    switch (type) {
      case "task":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
        );
      case "project":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
            />
          </svg>
        );
      case "team":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-purple-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        );
      default:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notificaciones</h1>
        <div className="flex space-x-2">
          {notifications.length > 0 && (
            <>
              <button
                onClick={handleMarkAllAsRead}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
                Marcar todas como leídas
              </button>
              <button
                onClick={handleDeleteAllNotifications}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm">
                Eliminar todas
              </button>
            </>
          )}
        </div>
      </div>

      {/* Pestañas de filtrado */}
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 ${
            activeTab === "all"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
          onClick={() => setActiveTab("all")}>
          Todas
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "unread"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
          onClick={() => setActiveTab("unread")}>
          No leídas
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "read"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
          onClick={() => setActiveTab("read")}>
          Leídas
        </button>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-600">Cargando notificaciones...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {!loading && !error && filteredNotifications.length === 0 && (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-gray-400 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <p className="text-gray-600 text-lg">
            No hay notificaciones{" "}
            {activeTab === "unread"
              ? "no leídas"
              : activeTab === "read"
              ? "leídas"
              : ""}
          </p>
        </div>
      )}

      {!loading && !error && filteredNotifications.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border-b last:border-b-0 ${
                notification.is_read ? "bg-white" : "bg-blue-50"
              }`}>
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-3">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(notification.created_at)}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      {notification.is_read === 0 && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="text-gray-400 hover:text-gray-600">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </button>
                      )}
                      <button
                        onClick={() =>
                          handleDeleteNotification(notification.id)
                        }
                        className="text-gray-400 hover:text-gray-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  {notification.reference_id && (
                    <a
                      href={`/${notification.type}s/${notification.reference_id}`}
                      className="text-xs text-blue-600 hover:text-blue-800 mt-2 inline-block"
                      onClick={() => {
                        if (notification.is_read === 0) {
                          handleMarkAsRead(notification.id);
                        }
                      }}>
                      Ver detalles
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
