const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");

// Importar middleware de autenticación
const { protect } = require("../middleware/authMiddleware");

// Aplicar middleware de autenticación a todas las rutas
router.use(protect);

// Rutas para notificaciones
router.get("/", notificationController.getNotificationsByUser);
router.get("/unread", notificationController.getUnreadNotifications);
router.get("/:id", notificationController.getNotificationById);
router.patch("/:id/read", notificationController.markAsRead);
router.patch("/read-all", notificationController.markAllAsRead);
router.delete("/:id", notificationController.deleteNotification);
router.delete("/", notificationController.deleteAllNotifications);

module.exports = router;
