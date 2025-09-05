const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

// Importar middleware de autenticación
const { protect } = require("../middleware/authMiddleware");

// Aplicar middleware de autenticación a todas las rutas
router.use(protect);

// Rutas para tareas
router.get("/", taskController.getAllTasks);
router.get("/my-tasks", taskController.getMyTasks);
router.get("/project/:projectId", taskController.getTasksByProject);
router.get("/:id", taskController.getTaskById);
router.post("/", taskController.createTask);
router.put("/:id", taskController.updateTask);
router.patch("/:id/status", taskController.updateTaskStatus);
router.delete("/:id", taskController.deleteTask);

module.exports = router;
