const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

// Todas las rutas requieren autenticación
router.use(protect);

// Crear un nuevo mensaje
router.post('/', messageController.createMessage);

// Obtener todos los mensajes de un usuario
router.get('/recipient/:userId', messageController.getMessagesByRecipient);

// Obtener mensajes no leídos del usuario autenticado
router.get('/unread', messageController.getUnreadMessages);

// Obtener mensajes no leídos de un usuario específico (para compatibilidad)
router.get('/unread/:userId', messageController.getUnreadMessages);

// Marcar un mensaje como leído
router.put('/:messageId/read', messageController.markAsRead);

// Eliminar un mensaje
router.delete('/:messageId', messageController.deleteMessage);

module.exports = router;