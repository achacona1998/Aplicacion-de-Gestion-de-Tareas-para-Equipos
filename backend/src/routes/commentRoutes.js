const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");

// Importar middleware de autenticación
const { protect } = require("../middleware/authMiddleware");

// Aplicar middleware de autenticación a todas las rutas
router.use(protect);

// Rutas para comentarios
router.get("/task/:taskId", commentController.getCommentsByTaskId);
router.get("/:id", commentController.getCommentById);
router.post("/", commentController.createComment);
router.put("/:id", commentController.updateComment);
router.delete("/:id", commentController.deleteComment);

module.exports = router;
