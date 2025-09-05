const Notification = require("../models/notificationModel");

// Controlador para obtener todas las notificaciones de un usuario
exports.getNotificationsByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await Notification.getNotificationsByUser(userId);

    res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error("Error al obtener notificaciones:", error.message);
    res.status(500).json({
      success: false,
      message: "Error al obtener notificaciones",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

// Controlador para obtener notificaciones no leídas de un usuario
exports.getUnreadNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await Notification.getUnreadNotifications(userId);

    res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error("Error al obtener notificaciones no leídas:", error.message);
    res.status(500).json({
      success: false,
      message: "Error al obtener notificaciones no leídas",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

// Controlador para obtener una notificación por ID
exports.getNotificationById = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const notification = await Notification.getNotificationById(notificationId);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notificación no encontrada",
      });
    }

    // Verificar si la notificación pertenece al usuario
    if (notification.user_id !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para ver esta notificación",
      });
    }

    res.status(200).json({
      success: true,
      notification,
    });
  } catch (error) {
    console.error("Error al obtener notificación:", error.message);
    res.status(500).json({
      success: false,
      message: "Error al obtener notificación",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

// Controlador para marcar una notificación como leída
exports.markAsRead = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const notification = await Notification.getNotificationById(notificationId);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notificación no encontrada",
      });
    }

    // Verificar si la notificación pertenece al usuario
    if (notification.user_id !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para modificar esta notificación",
      });
    }

    await Notification.markAsRead(notificationId);

    res.status(200).json({
      success: true,
      message: "Notificación marcada como leída exitosamente",
    });
  } catch (error) {
    console.error("Error al marcar notificación como leída:", error.message);
    res.status(500).json({
      success: false,
      message: "Error al marcar notificación como leída",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

// Controlador para marcar todas las notificaciones de un usuario como leídas
exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    await Notification.markAllAsRead(userId);

    res.status(200).json({
      success: true,
      message: "Todas las notificaciones marcadas como leídas exitosamente",
    });
  } catch (error) {
    console.error(
      "Error al marcar todas las notificaciones como leídas:",
      error.message
    );
    res.status(500).json({
      success: false,
      message: "Error al marcar todas las notificaciones como leídas",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

// Controlador para eliminar una notificación
exports.deleteNotification = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const notification = await Notification.getNotificationById(notificationId);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notificación no encontrada",
      });
    }

    // Verificar si la notificación pertenece al usuario
    if (notification.user_id !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para eliminar esta notificación",
      });
    }

    await Notification.deleteNotification(notificationId);

    res.status(200).json({
      success: true,
      message: "Notificación eliminada exitosamente",
    });
  } catch (error) {
    console.error("Error al eliminar notificación:", error.message);
    res.status(500).json({
      success: false,
      message: "Error al eliminar notificación",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

// Controlador para eliminar todas las notificaciones de un usuario
exports.deleteAllNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    await Notification.deleteAllNotifications(userId);

    res.status(200).json({
      success: true,
      message: "Todas las notificaciones eliminadas exitosamente",
    });
  } catch (error) {
    console.error("Error al eliminar todas las notificaciones:", error.message);
    res.status(500).json({
      success: false,
      message: "Error al eliminar todas las notificaciones",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};
