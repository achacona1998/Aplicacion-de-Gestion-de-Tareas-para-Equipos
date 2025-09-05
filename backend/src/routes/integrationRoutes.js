const express = require("express");
const router = express.Router();
const integrationController = require("../controllers/integrationController");
const { protect } = require("../middleware/authMiddleware");

// Rutas protegidas por autenticación
router.use(protect);

// Obtener todas las integraciones de un equipo
router.get("/team/:teamId", integrationController.getTeamIntegrations);

// Configurar integración con Slack para un equipo
router.post("/slack/team/:teamId", integrationController.configureSlackForTeam);

// Configurar integración con Microsoft Teams para un equipo
router.post("/teams/team/:teamId", integrationController.configureTeamsForTeam);

// Probar una integración
router.post("/:integrationId/test", integrationController.testIntegration);

// Activar/desactivar una integración
router.patch(
  "/:integrationId/status",
  integrationController.updateIntegrationStatus
);

// Eliminar una integración
router.delete("/:integrationId", integrationController.deleteIntegration);

module.exports = router;
