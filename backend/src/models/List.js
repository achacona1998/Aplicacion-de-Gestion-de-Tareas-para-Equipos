const mysql = require('mysql2/promise');
const pool = require('../config/database');

class List {
  static async create({ title, boardId, position }) {
    const [result] = await pool.execute(
      'INSERT INTO lists (title, board_id, position) VALUES (?, ?, ?)',
      [title, boardId, position]
    );
    return result.insertId;
  }

  static async getByBoardId(boardId) {
    const [rows] = await pool.execute(
      'SELECT * FROM lists WHERE board_id = ? ORDER BY position',
      [boardId]
    );
    return rows;
  }

  static async update({ listId, title }) {
    const [result] = await pool.execute(
      'UPDATE lists SET title = ? WHERE id = ?',
      [title, listId]
    );
    return result.affectedRows > 0;
  }

  static async updatePosition({ listId, position }) {
    const [result] = await pool.execute(
      'UPDATE lists SET position = ? WHERE id = ?',
      [position, listId]
    );
    return result.affectedRows > 0;
  }

  static async delete(listId) {
    const [result] = await pool.execute(
      'DELETE FROM lists WHERE id = ?',
      [listId]
    );
    return result.affectedRows > 0;
  }

  static async getMaxPosition(boardId) {
    const [rows] = await pool.execute(
      'SELECT MAX(position) as maxPos FROM lists WHERE board_id = ?',
      [boardId]
    );
    return rows[0].maxPos || 0;
  }
}

module.exports = List;