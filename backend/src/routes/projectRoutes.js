const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");

// Importar middleware de autenticación
const { protect } = require("../middleware/authMiddleware");

// Aplicar middleware de autenticación a todas las rutas
router.use(protect);

// Rutas para proyectos
router.get("/", projectController.getAllProjects);
router.get("/my-projects", projectController.getMyProjects);
router.get("/team/:teamId", projectController.getProjectsByTeam);
router.get("/:id", projectController.getProjectById);
router.post("/", projectController.createProject);
router.put("/:id", projectController.updateProject);
router.delete("/:id", projectController.deleteProject);

module.exports = router;
