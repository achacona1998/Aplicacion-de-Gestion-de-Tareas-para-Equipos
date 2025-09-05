const { pool } = require("../config/database");

class Notification {
  // Obtener todas las notificaciones de un usuario
  static async getNotificationsByUser(userId) {
    try {
      const [rows] = await pool.query(
        `
        SELECT * FROM notifications
        WHERE user_id = ?
        ORDER BY created_at DESC
      `,
        [userId]
      );
      return rows;
    } catch (error) {
      console.error(
        `Error al obtener notificaciones del usuario ${userId}:`,
        error.message
      );
      throw error;
    }
  }

  // Obtener notificaciones no leídas de un usuario
  static async getUnreadNotifications(userId) {
    try {
      const [rows] = await pool.query(
        `
        SELECT * FROM notifications
        WHERE user_id = ? AND is_read = 0
        ORDER BY created_at DESC
      `,
        [userId]
      );
      return rows;
    } catch (error) {
      console.error(
        `Error al obtener notificaciones no leídas del usuario ${userId}:`,
        error.message
      );
      throw error;
    }
  }

  // Obtener una notificación por ID
  static async getNotificationById(notificationId) {
    try {
      const [rows] = await pool.query(
        "SELECT * FROM notifications WHERE id = ?",
        [notificationId]
      );
      return rows[0];
    } catch (error) {
      console.error(
        `Error al obtener notificación con ID ${notificationId}:`,
        error.message
      );
      throw error;
    }
  }

  // Crear una nueva notificación
  static async createNotification(notificationData) {
    try {
      const { user_id, title, message, type, reference_id } = notificationData;
      const [result] = await pool.query(
        "INSERT INTO notifications (user_id, title, message, type, reference_id) VALUES (?, ?, ?, ?, ?)",
        [user_id, title, message, type, reference_id]
      );
      return result.insertId;
    } catch (error) {
      console.error("Error al crear notificación:", error.message);
      throw error;
    }
  }

  // Marcar notificación como leída
  static async markAsRead(notificationId) {
    try {
      const [result] = await pool.query(
        "UPDATE notifications SET is_read = 1 WHERE id = ?",
        [notificationId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error(
        `Error al marcar como leída la notificación ${notificationId}:`,
        error.message
      );
      throw error;
    }
  }

  // Marcar todas las notificaciones de un usuario como leídas
  static async markAllAsRead(userId) {
    try {
      const [result] = await pool.query(
        "UPDATE notifications SET is_read = 1 WHERE user_id = ?",
        [userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error(
        `Error al marcar todas las notificaciones como leídas para el usuario ${userId}:`,
        error.message
      );
      throw error;
    }
  }

  // Eliminar una notificación
  static async deleteNotification(notificationId) {
    try {
      const [result] = await pool.query(
        "DELETE FROM notifications WHERE id = ?",
        [notificationId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error(
        `Error al eliminar notificación con ID ${notificationId}:`,
        error.message
      );
      throw error;
    }
  }

  // Eliminar todas las notificaciones de un usuario
  static async deleteAllNotifications(userId) {
    try {
      const [result] = await pool.query(
        "DELETE FROM notifications WHERE user_id = ?",
        [userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error(
        `Error al eliminar todas las notificaciones del usuario ${userId}:`,
        error.message
      );
      throw error;
    }
  }
}

module.exports = Notification;
