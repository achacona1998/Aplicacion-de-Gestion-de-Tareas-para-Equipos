const { pool } = require("../config/database");

class Message {
  static async create({ sender_id, recipient_id, title, message }) {
    const query =
      "INSERT INTO messages (sender_id, recipient_id, title, message, is_read, created_at) VALUES (?, ?, ?, ?, false, NOW())";
    const [result] = await pool.execute(query, [
      sender_id,
      recipient_id,
      title,
      message,
    ]);

    // Obtener el mensaje recién creado
    const newMessage = await this.findById(result.insertId);
    return newMessage;
  }

  static async findById(id) {
    const query = "SELECT * FROM messages WHERE id = ?";
    const [messages] = await pool.execute(query, [id]);
    return messages[0];
  }

  static async findByRecipient(recipientId) {
    const query =
      "SELECT * FROM messages WHERE recipient_id = ? ORDER BY created_at DESC";
    const [messages] = await pool.execute(query, [recipientId]);
    return messages;
  }

  static async findUnreadByRecipient(recipientId) {
    const query =
      "SELECT * FROM messages WHERE recipient_id = ? AND is_read = false ORDER BY created_at DESC";
    const [messages] = await pool.execute(query, [recipientId]);
    return messages;
  }

  static async markAsRead(id) {
    const query = "UPDATE messages SET is_read = true WHERE id = ?";
    const [result] = await pool.execute(query, [id]);
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const query = "DELETE FROM messages WHERE id = ?";
    const [result] = await pool.execute(query, [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Message;
