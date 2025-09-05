import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getUnreadNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../services/notifications";
import { Bell } from "lucide-react";

const NotificationMenu = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  // Cargar notificaciones no leídas
  const fetchNotifications = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getUnreadNotifications();
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
    // Configurar un intervalo para actualizar las notificaciones cada 5 minutos
    const interval = setInterval(fetchNotifications, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Marcar una notificación como leída
  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
      // Actualizar el estado local
      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== notificationId)
      );
    } catch (err) {
      console.error("Error al marcar notificación como leída:", err);
    }
  };

  // Marcar todas las notificaciones como leídas
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setNotifications([]);
      setShowMenu(false);
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

  // Formatear la fecha de la notificación
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Determinar el icono según el tipo de notificación
  const getNotificationIcon = (type) => {
    switch (type) {
      case "task":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-blue-500"
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
            className="h-5 w-5 text-green-500"
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
            className="h-5 w-5 text-purple-500"
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
            className="h-5 w-5 text-gray-500"
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
    <div className="relative  flex items-center">
      {/* Botón de notificaciones */}
      <button onClick={() => setShowMenu(!showMenu)} className=" relative">
        <Bell className="w-8 h-8" />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </button>

      {/* Menú desplegable de notificaciones */}
      {showMenu && (
        <div className="absolute right-0 top-8 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-20">
          <div className="px-4 py-2 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-sm font-semibold text-gray-700">
              Notificaciones
            </h3>
            {notifications.length > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-800">
                Marcar todas como leídas
              </button>
            )}
          </div>

          {loading && (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">
              Cargando notificaciones...
            </div>
          )}

          {error && (
            <div className="px-4 py-3 text-sm text-red-500">{error}</div>
          )}

          {!loading && !error && notifications.length === 0 && (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">
              No tienes notificaciones nuevas
            </div>
          )}

          {!loading &&
            !error &&
            notifications.length > 0 &&
            notifications.map((notification) => (
              <div
                key={notification.id}
                className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="text-gray-400 hover:text-gray-600">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
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
                        <button
                          onClick={() =>
                            handleDeleteNotification(notification.id)
                          }
                          className="text-gray-400 hover:text-gray-600">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
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
                    <p className="text-sm text-gray-600 mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDate(notification.created_at)}
                    </p>
                    {notification.reference_id && (
                      <Link
                        to={`/${notification.type}s/${notification.reference_id}`}
                        className="text-xs text-blue-600 hover:text-blue-800 mt-1 inline-block"
                        onClick={() => {
                          handleMarkAsRead(notification.id);
                          setShowMenu(false);
                        }}>
                        Ver detalles
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}

          <div className="px-4 py-2 border-t border-gray-200">
            <Link
              to="/notifications"
              className="text-xs text-blue-600 hover:text-blue-800 block text-center"
              onClick={() => setShowMenu(false)}>
              Ver todas las notificaciones
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationMenu;
