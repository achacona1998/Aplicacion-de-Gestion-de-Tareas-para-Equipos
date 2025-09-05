const express = require("express");
const router = express.Router();
const kanbanController = require("../controllers/kanbanController");

// Importar middleware de autenticación
const { protect } = require("../middleware/authMiddleware");

// Aplicar middleware de autenticación a todas las rutas
router.use(protect);

// Rutas para tablero Kanban
router.get("/", kanbanController.getKanbanBoard);
router.get("/project/:projectId", kanbanController.getKanbanBoard);
router.patch("/task/:taskId/move", kanbanController.moveTaskInKanban);

module.exports = router;
