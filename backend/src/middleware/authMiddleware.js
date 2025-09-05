const User = require("../models/userModel");
const { verifyToken, generateNewToken } = require("../utils/jwtUtils");

// Middleware para verificar token JWT y proteger rutas
exports.protect = async (req, res, next) => {
  try {
    let token;

    // 1. Buscar el token en headers o cookies
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // 2. Si no hay token, denegar acceso
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No estás autorizado para acceder a este recurso",
      });
    }

    // 3. Verificar el token
    const { valid, expired, decoded } = verifyToken(token);

    if (!valid) {
      return res.status(401).json({
        success: false,
        message: expired
          ? "Tu sesión ha expirado, inicia sesión nuevamente"
          : "Token inválido",
      });
    }

    // 4. (Opcional) Renovar token si está por expirar
    // if (expired && decoded) {
    //   const newToken = generateNewToken(decoded);
    //   res.setHeader("Authorization", `Bearer ${newToken}`);
    // }

    // 5. Buscar usuario en la base de datos
    const user = await User.getUserById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "El usuario ya no existe",
      });
    }

    // 6. Adjuntar usuario a la request
    req.user = user;
    next();
  } catch (error) {
    console.error(
      `Error en middleware de autenticación: ${error.message} | IP: ${req.ip} | Ruta: ${req.path}`
    );
    res.status(500).json({
      success: false,
      message: "Error en la autenticación",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

// Middleware para restringir acceso según roles
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para realizar esta acción",
      });
    }
    next();
  };
};

// Middleware para simular autenticación (solo para desarrollo)
exports.simulateAuth = (req, res, next) => {
  req.user = {
    id: 1,
    username: "usuario_test",
    email: "test@example.com",
    role: "admin",
  };
  next();
};
