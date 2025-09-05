const mysql = require('mysql2/promise');
const pool = require('../config/database');

class Card {
  static async create({ title, description, listId, position, dueDate, assignedTo, labels }) {
    const [result] = await pool.execute(
      'INSERT INTO cards (title, description, list_id, position, due_date, assigned_to, labels) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, description, listId, position, dueDate, assignedTo, JSON.stringify(labels)]
    );
    return result.insertId;
  }

  static async getByListId(listId) {
    const [rows] = await pool.execute(
      'SELECT * FROM cards WHERE list_id = ? ORDER BY position',
      [listId]
    );
    return rows.map(card => ({
      ...card,
      labels: JSON.parse(card.labels || '[]')
    }));
  }

  static async getById(cardId) {
    const [rows] = await pool.execute(
      'SELECT * FROM cards WHERE id = ?',
      [cardId]
    );
    if (rows[0]) {
      rows[0].labels = JSON.parse(rows[0].labels || '[]');
    }
    return rows[0];
  }

  static async update({ cardId, title, description, dueDate, assignedTo, labels }) {
    const [result] = await pool.execute(
      'UPDATE cards SET title = ?, description = ?, due_date = ?, assigned_to = ?, labels = ? WHERE id = ?',
      [title, description, dueDate, assignedTo, JSON.stringify(labels), cardId]
    );
    return result.affectedRows > 0;
  }

  static async updatePosition({ cardId, listId, position }) {
    const [result] = await pool.execute(
      'UPDATE cards SET list_id = ?, position = ? WHERE id = ?',
      [listId, position, cardId]
    );
    return result.affectedRows > 0;
  }

  static async delete(cardId) {
    const [result] = await pool.execute(
      'DELETE FROM cards WHERE id = ?',
      [cardId]
    );
    return result.affectedRows > 0;
  }

  static async getMaxPosition(listId) {
    const [rows] = await pool.execute(
      'SELECT MAX(position) as maxPos FROM cards WHERE list_id = ?',
      [listId]
    );
    return rows[0].maxPos || 0;
  }
}

module.exports = Card;