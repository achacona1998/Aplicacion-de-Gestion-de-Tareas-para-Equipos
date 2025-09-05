const mysql = require('mysql2/promise');
const pool = require('../config/database');

class Board {
  static async create({ title, description, userId }) {
    const [result] = await pool.execute(
      'INSERT INTO boards (title, description, user_id) VALUES (?, ?, ?)',
      [title, description, userId]
    );
    return result.insertId;
  }

  static async getById(boardId) {
    const [rows] = await pool.execute(
      'SELECT * FROM boards WHERE id = ?',
      [boardId]
    );
    return rows[0];
  }

  static async getByUserId(userId) {
    const [rows] = await pool.execute(
      'SELECT * FROM boards WHERE user_id = ?',
      [userId]
    );
    return rows;
  }

  static async update({ boardId, title, description }) {
    const [result] = await pool.execute(
      'UPDATE boards SET title = ?, description = ? WHERE id = ?',
      [title, description, boardId]
    );
    return result.affectedRows > 0;
  }

  static async delete(boardId) {
    const [result] = await pool.execute(
      'DELETE FROM boards WHERE id = ?',
      [boardId]
    );
    return result.affectedRows > 0;
  }
}

module.exports = Board;