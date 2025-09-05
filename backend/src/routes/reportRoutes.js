const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const { protect } = require("../middleware/authMiddleware");

// Proteger todas las rutas de reportes
router.use(protect);

// Reporte de productividad por usuario
router.get("/user/:userId", reportController.getUserProductivityReport);

// Reporte de productividad por proyecto
router.get(
  "/project/:projectId",
  reportController.getProjectProductivityReport
);

module.exports = router;
