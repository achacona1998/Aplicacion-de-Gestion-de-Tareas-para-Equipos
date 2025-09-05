const { pool } = require("../config/database");

class Comment {
  // Obtener todos los comentarios de una tarea
  static async getCommentsByTaskId(taskId) {
    try {
      const [rows] = await pool.query(
        `
        SELECT c.*, u.username as user_name 
        FROM task_comments c
        LEFT JOIN users u ON c.user_id = u.id
        WHERE c.task_id = ?
        ORDER BY c.created_at DESC
      `,
        [taskId]
      );
      return rows;
    } catch (error) {
      console.error(
        `Error al obtener comentarios de la tarea ${taskId}:`,
        error.message
      );
      throw error;
    }
  }

  // Obtener un comentario por ID
  static async getCommentById(commentId) {
    try {
      const [rows] = await pool.query(
        `
        SELECT c.*, u.username as user_name 
        FROM task_comments c
        LEFT JOIN users u ON c.user_id = u.id
        WHERE c.id = ?
      `,
        [commentId]
      );
      return rows[0];
    } catch (error) {
      console.error(
        `Error al obtener comentario con ID ${commentId}:`,
        error.message
      );
      throw error;
    }
  }

  // Crear un nuevo comentario
  static async createComment(commentData) {
    try {
      const { task_id, user_id, comment } = commentData;
      const [result] = await pool.query(
        "INSERT INTO task_comments (task_id, user_id, comment) VALUES (?, ?, ?)",
        [task_id, user_id, comment]
      );
      return result.insertId;
    } catch (error) {
      console.error("Error al crear comentario:", error.message);
      throw error;
    }
  }

  // Actualizar un comentario
  static async updateComment(commentId, commentData) {
    try {
      const { comment } = commentData;
      const [result] = await pool.query(
        "UPDATE task_comments SET comment = ? WHERE id = ?",
        [comment, commentId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error(
        `Error al actualizar comentario con ID ${commentId}:`,
        error.message
      );
      throw error;
    }
  }

  // Eliminar un comentario
  static async deleteComment(commentId) {
    try {
      const [result] = await pool.query(
        "DELETE FROM task_comments WHERE id = ?",
        [commentId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error(
        `Error al eliminar comentario con ID ${commentId}:`,
        error.message
      );
      throw error;
    }
  }
}

module.exports = Comment;
