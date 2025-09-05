const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Importar middleware de autenticación
const { protect, restrictTo } = require("../middleware/authMiddleware");

// Rutas públicas (no requieren autenticación)
router.post("/register", userController.register);
router.post("/login", userController.login);

// Aplicar middleware de autenticación a todas las rutas siguientes
router.use(protect);

// Rutas protegidas (requieren autenticación)
router.get("/profile", userController.getProfile);
router.put("/profile", userController.updateProfile);
router.put("/change-password", userController.changePassword);

// Ruta para obtener el equipo de un usuario
router.get("/:id/team", userController.getUserTeam);

// Rutas de administración (solo para administradores)
router.get("/", restrictTo("admin"), userController.getAllUsers);
router.get("/:id", restrictTo("admin"), userController.getUserById);
router.put("/:id", restrictTo("admin"), userController.updateUser);
router.delete("/:id", restrictTo("admin"), userController.deleteUser);

module.exports = router;
