const Message = require('../models/messageModel');
const { validateMessage } = require('../utils/validators');

// Create a new message
exports.createMessage = async (req, res) => {
  try {
    const { recipient_id, title, message } = req.body;
    const sender_id = req.user.id;

    // Validar los datos del mensaje
    const validationError = validateMessage({ sender_id, recipient_id, title, message });
    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError
      });
    }

    const newMessage = await Message.create({
      sender_id,
      recipient_id,
      title,
      message
    });

    res.status(201).json({
      success: true,
      message: 'Mensaje enviado exitosamente',
      data: newMessage
    });
  } catch (error) {
    console.error('Error al crear mensaje:', error);
    res.status(500).json({
      success: false,
      message: 'Error al enviar el mensaje'
    });
  }
};

// Get messages for a specific user
exports.getMessagesByRecipient = async (req, res) => {
  try {
    const { userId } = req.params;
    const messages = await Message.findByRecipient(userId);

    res.json({
      success: true,
      data: messages
    });
  } catch (error) {
    console.error('Error al obtener mensajes:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los mensajes'
    });
  }
};

// Get unread messages for the logged-in user
exports.getUnreadMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const messages = await Message.findUnreadByRecipient(userId);

    res.json({
      success: true,
      data: messages
    });
  } catch (error) {
    console.error('Error al obtener mensajes no leídos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los mensajes no leídos'
    });
  }
};

// Mark a message as read
exports.markAsRead = async (req, res) => {
  try {
    const messageId = req.params.messageId;
    const userId = req.user.id;

    // Verificar que el mensaje existe y pertenece al usuario
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Mensaje no encontrado'
      });
    }

    if (message.recipient_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'No autorizado para realizar esta acción'
      });
    }

    await Message.markAsRead(messageId);

    res.json({
      success: true,
      message: 'Mensaje marcado como leído'
    });
  } catch (error) {
    console.error('Error al marcar mensaje como leído:', error);
    res.status(500).json({
      success: false,
      message: 'Error al marcar el mensaje como leído'
    });
  }
};

// Delete a message
exports.deleteMessage = async (req, res) => {
  try {
    const messageId = req.params.id;
    const userId = req.user.id;

    // Verificar que el mensaje existe y pertenece al usuario
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Mensaje no encontrado'
      });
    }

    if (message.recipient_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'No autorizado para realizar esta acción'
      });
    }

    await Message.delete(messageId);

    res.json({
      success: true,
      message: 'Mensaje eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar mensaje:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el mensaje'
    });
  }
};