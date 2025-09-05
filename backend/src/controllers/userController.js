const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pool } = require("../config/database");

// Controlador para registrar un nuevo usuario
exports.register = async (req, res) => {
  try {
    const { username, email, password, full_name, role } = req.body;

    // Validar datos de entrada
    if (!username || !email || !password || !full_name) {
      return res.status(400).json({
        success: false,
        message: "Todos los campos son obligatorios",
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "El correo electrónico ya está registrado",
      });
    }

    // Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear usuario
    const userData = {
      username,
      email,
      password: hashedPassword,
      full_name,
      role: role || "user", // Por defecto, el rol es 'user'
    };

    const userId = await User.createUser(userData);

    // Generar token JWT
    const token = jwt.sign(
      { id: userId, username, email, role: userData.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      success: true,
      message: "Usuario registrado correctamente",
      token,
      user: {
        id: userId,
        username,
        email,
        full_name,
        role: userData.role,
      },
    });
  } catch (error) {
    console.error("Error al registrar usuario:", error.message);
    res.status(500).json({
      success: false,
      message: "Error al registrar usuario",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

// Controlador para iniciar sesión
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar datos de entrada
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "El correo electrónico y la contraseña son obligatorios",
      });
    }

    // Verificar si el usuario existe
    const user = await User.getUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas",
      });
    }

    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.password);


    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas",
      });
    }

    // Generar token JWT
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({
      success: true,
      message: "Inicio de sesión exitoso",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error.message);
    res.status(500).json({
      success: false,
      message: "Error al iniciar sesión",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

// Controlador para obtener el perfil del usuario actual
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.getUserById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    });
  } catch (error) {
    console.error("Error al obtener perfil:", error.message);
    res.status(500).json({
      success: false,
      message: "Error al obtener perfil",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

// Controlador para actualizar el perfil del usuario actual
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, full_name, password } = req.body;

    // Verificar si el usuario existe
    const user = await User.getUserById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    // Preparar datos para actualizar
    const userData = {};

    if (username) userData.username = username;
    if (full_name) userData.full_name = full_name;

    // Si se proporciona una nueva contraseña, hashearla
    if (password) {
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(password, salt);
    }

    // Actualizar usuario
    const updated = await User.updateUser(userId, userData);

    if (!updated) {
      return res.status(400).json({
        success: false,
        message: "No se pudo actualizar el perfil",
      });
    }

    res.status(200).json({
      success: true,
      message: "Perfil actualizado correctamente",
    });
  } catch (error) {
    console.error("Error al actualizar perfil:", error.message);
    res.status(500).json({
      success: false,
      message: "Error al actualizar perfil",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

// Controlador para obtener todos los usuarios (solo admin)
exports.getAllUsers = async (req, res) => {
  try {
    // Verificar si el usuario es admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para ver todos los usuarios",
      });
    }

    const users = await User.getAllUsers();

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Error al obtener usuarios:", error.message);
    res.status(500).json({
      success: false,
      message: "Error al obtener usuarios",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

// Controlador para obtener un usuario por ID (solo admin)
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    // Verificar si el usuario es admin o es el propio usuario
    if (req.user.role !== "admin" && req.user.id !== parseInt(userId)) {
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para ver este usuario",
      });
    }

    const user = await User.getUserById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(`Error al obtener usuario ${req.params.id}:`, error.message);
    res.status(500).json({
      success: false,
      message: "Error al obtener usuario",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

// Controlador para actualizar un usuario (solo admin)
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { username, email, full_name, role, password } = req.body;

    // Verificar si el usuario es admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para actualizar usuarios",
      });
    }

    // Verificar si el usuario existe
    const user = await User.getUserById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    // Preparar datos para actualizar
    const userData = {};

    if (username) userData.username = username;
    if (email) userData.email = email;
    if (full_name) userData.full_name = full_name;
    if (role) userData.role = role;

    // Si se proporciona una nueva contraseña, hashearla
    if (password) {
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(password, salt);
    }

    // Actualizar usuario
    const updated = await User.updateUser(userId, userData);

    if (!updated) {
      return res.status(400).json({
        success: false,
        message: "No se pudo actualizar el usuario",
      });
    }

    res.status(200).json({
      success: true,
      message: "Usuario actualizado correctamente",
    });
  } catch (error) {
    console.error(
      `Error al actualizar usuario ${req.params.id}:`,
      error.message
    );
    res.status(500).json({
      success: false,
      message: "Error al actualizar usuario",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

// Controlador para eliminar un usuario (solo admin)
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Verificar si el usuario es admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para eliminar usuarios",
      });
    }

    // No permitir eliminar al propio usuario
    if (req.user.id === parseInt(userId)) {
      return res.status(400).json({
        success: false,
        message: "No puedes eliminar tu propia cuenta",
      });
    }

    // Verificar si el usuario existe
    const user = await User.getUserById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    // Eliminar usuario
    const deleted = await User.deleteUser(userId);

    if (!deleted) {
      return res.status(400).json({
        success: false,
        message: "No se pudo eliminar el usuario",
      });
    }

    res.status(200).json({
      success: true,
      message: "Usuario eliminado correctamente",
    });
  } catch (error) {
    console.error(`Error al eliminar usuario ${req.params.id}:`, error.message);
    res.status(500).json({
      success: false,
      message: "Error al eliminar usuario",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

// Controlador para cambiar el rol de un usuario (solo admin)
exports.changeUserRole = async (req, res) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;

    // Verificar si el usuario es admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para cambiar roles de usuarios",
      });
    }

    // Validar el rol
    if (!role || !["admin", "user", "manager"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Rol inválido. Los roles permitidos son: admin, user, manager",
      });
    }

    // Verificar si el usuario existe
    const user = await User.getUserById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    // Actualizar rol
    const updated = await User.updateUser(userId, { role });

    if (!updated) {
      return res.status(400).json({
        success: false,
        message: "No se pudo actualizar el rol del usuario",
      });
    }

    res.status(200).json({
      success: true,
      message: `Rol de usuario actualizado a ${role} correctamente`,
    });
  } catch (error) {
    console.error(
      `Error al cambiar rol de usuario ${req.params.id}:`,
      error.message
    );
    res.status(500).json({
      success: false,
      message: "Error al cambiar rol de usuario",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

// Controlador para buscar usuarios por nombre o email (solo admin)
exports.searchUsers = async (req, res) => {
  try {
    const { query } = req.query;

    // Verificar si el usuario es admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para buscar usuarios",
      });
    }

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Se requiere un término de búsqueda",
      });
    }

    const users = await User.searchUsers(query);

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Error al buscar usuarios:", error.message);
    res.status(500).json({
      success: false,
      message: "Error al buscar usuarios",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

// Controlador para verificar token JWT
exports.verifyToken = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.getUserById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error al verificar token:", error.message);
    res.status(500).json({
      success: false,
      message: "Error al verificar token",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

// Controlador para cambiar la contraseña del usuario
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    // Validar datos de entrada
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "La contraseña actual y la nueva contraseña son obligatorias",
      });
    }

    // Verificar si el usuario existe
    const user = await User.getUserById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    // Verificar contraseña actual
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "La contraseña actual es incorrecta",
      });
    }

    // Hashear la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Actualizar contraseña
    const updated = await User.updateUser(userId, { password: hashedPassword });

    if (!updated) {
      return res.status(400).json({
        success: false,
        message: "No se pudo actualizar la contraseña",
      });
    }

    res.status(200).json({
      success: true,
      message: "Contraseña actualizada correctamente",
    });
  } catch (error) {
    console.error("Error al cambiar contraseña:", error.message);
    res.status(500).json({
      success: false,
      message: "Error al cambiar contraseña",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

// Controlador para obtener el equipo de un usuario
exports.getUserTeam = async (req, res) => {
  try {
    const userId = req.params.id;

    // Verificar si el usuario tiene permiso para ver esta información
    // (si es el propio usuario o un administrador)
    if (req.user.role !== "admin" && req.user.id !== parseInt(userId)) {
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para ver esta información",
      });
    }

    // Obtener el equipo del usuario
    const [rows] = await pool.query(
      `
      SELECT t.* 
      FROM teams t
      JOIN team_members tm ON t.id = tm.team_id
      WHERE tm.user_id = ?
      LIMIT 1
      `,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "El usuario no pertenece a ningún equipo",
      });
    }

    res.status(200).json({
      success: true,
      team: rows[0],
    });
  } catch (error) {
    console.error(`Error al obtener equipo del usuario ${req.params.id}:`, error.message);
    res.status(500).json({
      success: false,
      message: "Error al obtener equipo del usuario",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};
