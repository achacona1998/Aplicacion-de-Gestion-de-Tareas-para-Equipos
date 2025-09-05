const { pool } = require("../config/database");

class User {
  // Obtener todos los usuarios
  static async getAllUsers() {
    try {
      const [rows] = await pool.query(
        "SELECT id, username, email, full_name, role, created_at, updated_at FROM users"
      );
      return rows;
    } catch (error) {
      console.error("Error al obtener usuarios:", error.message);
      throw error;
    }
  }

  // Obtener un usuario por ID
  static async getUserById(userId) {
    try {
      const [rows] = await pool.query(
        "SELECT id, username, email, full_name, role, created_at, updated_at FROM users WHERE id = ?",
        [userId]
      );
      return rows[0];
    } catch (error) {
      console.error(
        `Error al obtener usuario con ID ${userId}:`,
        error.message
      );
      throw error;
    }
  }

  // Obtener un usuario por email
  static async getUserByEmail(email) {
    try {
      const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
        email,
      ]);
      return rows[0];
    } catch (error) {
      console.error(
        `Error al obtener usuario con email ${email}:`,
        error.message
      );
      throw error;
    }
  }

  // Crear un nuevo usuario
  static async createUser(userData) {
    try {
      const { username, email, password, full_name, role } = userData;
      const [result] = await pool.query(
        "INSERT INTO users (username, email, password, full_name, role) VALUES (?, ?, ?, ?, ?)",
        [username, email, password, full_name, role]
      );
      return result.insertId;
    } catch (error) {
      console.error("Error al crear usuario:", error.message);
      throw error;
    }
  }

  // Actualizar un usuario
  static async updateUser(userId, userData) {
    try {
      const { username, email, full_name, role } = userData;
      const [result] = await pool.query(
        "UPDATE users SET username = ?, email = ?, full_name = ?, role = ?, updated_at = NOW() WHERE id = ?",
        [username, email, full_name, role, userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error(
        `Error al actualizar usuario con ID ${userId}:`,
        error.message
      );
      throw error;
    }
  }

  // Actualizar contraseña de usuario
  static async updatePassword(userId, newPassword) {
    try {
      const [result] = await pool.query(
        "UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?",
        [newPassword, userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error(
        `Error al actualizar contraseña del usuario con ID ${userId}:`,
        error.message
      );
      throw error;
    }
  }

  // Eliminar un usuario
  static async deleteUser(userId) {
    try {
      const [result] = await pool.query("DELETE FROM users WHERE id = ?", [
        userId,
      ]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error(
        `Error al eliminar usuario con ID ${userId}:`,
        error.message
      );
      throw error;
    }
  }
}

module.exports = User;
