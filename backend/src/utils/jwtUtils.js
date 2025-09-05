const jwt = require("jsonwebtoken");

/**
 * Genera un token JWT para un usuario
 * @param {Object} user - Datos del usuario para incluir en el token
 * @returns {String} Token JWT generado
 */
exports.generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

/**
 * Verifica un token JWT
 * @param {String} token - Token JWT a verificar
 * @returns {Object} Datos decodificados del token
 */
exports.verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (error) {
    return {
      valid: false,
      expired: error.name === "TokenExpiredError",
      decoded: null,
    };
  }
};

/**
 * Refresca un token JWT
 * @param {String} token - Token JWT a refrescar
 * @returns {String|null} Nuevo token JWT o null si el token es inválido
 */
exports.refreshToken = (token) => {
  const { valid, decoded } = exports.verifyToken(token);

  if (!valid) return null;

  return exports.generateToken({
    id: decoded.id,
    username: decoded.username,
    email: decoded.email,
    role: decoded.role,
  });
};
