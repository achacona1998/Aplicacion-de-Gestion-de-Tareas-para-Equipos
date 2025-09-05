const express = require("express");
const router = express.Router();
const teamController = require("../controllers/teamController");

// Importar middleware de autenticación
const { protect, restrictTo } = require("../middleware/authMiddleware");

// Aplicar middleware de autenticación a todas las rutas
router.use(protect);

// Rutas para equipos
router.get("/", teamController.getAllTeams);
router.get("/:id", teamController.getTeamById);
router.get("/:id/members", teamController.getTeamMembers);
router.post("/", teamController.createTeam);
router.put("/:id", teamController.updateTeam);
router.delete("/:id", teamController.deleteTeam);
router.post("/:id/members", teamController.addTeamMember);
router.delete("/:id/members/:userId", teamController.removeTeamMember);

module.exports = router;
