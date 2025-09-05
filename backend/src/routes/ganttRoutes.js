const express = require("express");
const router = express.Router();
const ganttController = require("../controllers/ganttController");

// Importar middleware de autenticación
const { protect } = require("../middleware/authMiddleware");

// Aplicar middleware de autenticación a todas las rutas
router.use(protect);

// Rutas para diagramas de Gantt
router.get("/projects", ganttController.getProjectsGanttData);
router.get("/project/:projectId", ganttController.getProjectGanttData);

module.exports = router;
