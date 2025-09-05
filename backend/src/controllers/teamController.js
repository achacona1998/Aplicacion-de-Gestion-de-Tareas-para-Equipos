const Team = require("../models/teamModel");
const User = require("../models/userModel");

// Controlador para obtener todos los equipos
exports.getAllTeams = async (req, res) => {
  try {
    // Si el usuario no es admin, solo obtener equipos relacionados con él
    let teams;
    if (req.user.role === "admin") {
      teams = await Team.getAllTeams();
    } else {
      // Obtener equipos a los que pertenece el usuario
      teams = await Team.getTeamsByUser(req.user.id);
    }

    res.status(200).json({
      success: true,
      count: teams.length,
      teams,
    });
  } catch (error) {
    console.error("Error al obtener equipos:", error.message);
    res.status(500).json({
      success: false,
      message: "Error al obtener equipos",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

// Controlador para obtener un equipo por ID
exports.getTeamById = async (req, res) => {
  try {
    const teamId = req.params.id;
    const team = await Team.getTeamById(teamId);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Equipo no encontrado",
      });
    }

    // Verificar si el usuario tiene acceso al equipo
    if (req.user.role !== "admin") {
      const isMember = await Team.isTeamMember(teamId, req.user.id);
      if (!isMember) {
        return res.status(403).json({
          success: false,
          message: "No tienes permiso para ver este equipo",
        });
      }
    }

    // Obtener miembros del equipo
    const members = await Team.getTeamMembers(teamId);

    res.status(200).json({
      success: true,
      team,
      members,
    });
  } catch (error) {
    console.error(`Error al obtener equipo ${req.params.id}:`, error.message);
    res.status(500).json({
      success: false,
      message: "Error al obtener equipo",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

// Controlador para crear un nuevo equipo
exports.createTeam = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Validar datos de entrada
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "El nombre del equipo es obligatorio",
      });
    }

    // Crear equipo
    const teamData = {
      name,
      description,
      created_by: req.user.id,
    };

    const teamId = await Team.createTeam(teamData);

    // Añadir al creador como líder del equipo
    await Team.addTeamMember(teamId, req.user.id, "leader");

    res.status(201).json({
      success: true,
      message: "Equipo creado correctamente",
      teamId,
    });
  } catch (error) {
    console.error("Error al crear equipo:", error.message);
    res.status(500).json({
      success: false,
      message: "Error al crear equipo",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

// Controlador para actualizar un equipo
exports.updateTeam = async (req, res) => {
  try {
    const teamId = req.params.id;
    const { name, description } = req.body;

    // Validar datos de entrada
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "El nombre del equipo es obligatorio",
      });
    }

    // Verificar si el equipo existe
    const team = await Team.getTeamById(teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Equipo no encontrado",
      });
    }

    // Verificar permisos (solo admin o líder del equipo pueden actualizar)
    if (req.user.role !== "admin") {
      const isLeader = await Team.isTeamLeader(teamId, req.user.id);
      if (!isLeader) {
        return res.status(403).json({
          success: false,
          message: "No tienes permiso para actualizar este equipo",
        });
      }
    }

    // Actualizar equipo
    const teamData = {
      name,
      description,
    };

    const updated = await Team.updateTeam(teamId, teamData);

    if (!updated) {
      return res.status(400).json({
        success: false,
        message: "No se pudo actualizar el equipo",
      });
    }

    res.status(200).json({
      success: true,
      message: "Equipo actualizado correctamente",
    });
  } catch (error) {
    console.error(
      `Error al actualizar equipo ${req.params.id}:`,
      error.message
    );
    res.status(500).json({
      success: false,
      message: "Error al actualizar equipo",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

// Controlador para eliminar un equipo
exports.deleteTeam = async (req, res) => {
  try {
    const teamId = req.params.id;

    // Verificar si el equipo existe
    const team = await Team.getTeamById(teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Equipo no encontrado",
      });
    }

    // Verificar permisos (solo admin o creador del equipo pueden eliminar)
    if (req.user.role !== "admin" && team.created_by !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para eliminar este equipo",
      });
    }

    // Eliminar equipo
    const deleted = await Team.deleteTeam(teamId);

    if (!deleted) {
      return res.status(400).json({
        success: false,
        message: "No se pudo eliminar el equipo",
      });
    }

    res.status(200).json({
      success: true,
      message: "Equipo eliminado correctamente",
    });
  } catch (error) {
    console.error(`Error al eliminar equipo ${req.params.id}:`, error.message);
    res.status(500).json({
      success: false,
      message: "Error al eliminar equipo",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

// Controlador para añadir un miembro a un equipo
exports.addTeamMember = async (req, res) => {
  try {
    const teamId = req.params.id;
    const { userId, role = "member" } = req.body;

    // Validar datos de entrada
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "El ID del usuario es obligatorio",
      });
    }

    // Verificar si el equipo existe
    const team = await Team.getTeamById(teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Equipo no encontrado",
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

    // Verificar permisos (solo admin o líder del equipo pueden añadir miembros)
    if (req.user.role !== "admin") {
      const isLeader = await Team.isTeamLeader(teamId, req.user.id);
      if (!isLeader) {
        return res.status(403).json({
          success: false,
          message: "No tienes permiso para añadir miembros a este equipo",
        });
      }
    }

    // Verificar si el usuario ya es miembro del equipo
    const isMember = await Team.isTeamMember(teamId, userId);
    if (isMember) {
      return res.status(400).json({
        success: false,
        message: "El usuario ya es miembro de este equipo",
      });
    }

    // Añadir miembro al equipo
    await Team.addTeamMember(teamId, userId, role);

    res.status(200).json({
      success: true,
      message: "Miembro añadido al equipo correctamente",
    });
  } catch (error) {
    console.error(
      `Error al añadir miembro al equipo ${req.params.id}:`,
      error.message
    );
    res.status(500).json({
      success: false,
      message: "Error al añadir miembro al equipo",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

// Controlador para eliminar un miembro de un equipo
exports.removeTeamMember = async (req, res) => {
  try {
    const teamId = req.params.id;
    const userId = req.params.userId;

    // Verificar si el equipo existe
    const team = await Team.getTeamById(teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Equipo no encontrado",
      });
    }

    // Verificar si el usuario es miembro del equipo
    const isMember = await Team.isTeamMember(teamId, userId);
    if (!isMember) {
      return res.status(400).json({
        success: false,
        message: "El usuario no es miembro de este equipo",
      });
    }

    // Verificar permisos (solo admin, líder del equipo o el propio usuario pueden eliminar miembros)
    if (req.user.role !== "admin" && req.user.id !== userId) {
      const isLeader = await Team.isTeamLeader(teamId, req.user.id);
      if (!isLeader) {
        return res.status(403).json({
          success: false,
          message: "No tienes permiso para eliminar miembros de este equipo",
        });
      }
    }

    // No permitir eliminar al último líder del equipo
    if (await Team.isTeamLeader(teamId, userId)) {
      const members = await Team.getTeamMembers(teamId);
      const leaders = members.filter((member) => member.team_role === "leader");
      if (leaders.length <= 1) {
        return res.status(400).json({
          success: false,
          message: "No se puede eliminar al último líder del equipo",
        });
      }
    }

    // Eliminar miembro del equipo
    const removed = await Team.removeTeamMember(teamId, userId);

    if (!removed) {
      return res.status(400).json({
        success: false,
        message: "No se pudo eliminar al miembro del equipo",
      });
    }

    res.status(200).json({
      success: true,
      message: "Miembro eliminado del equipo correctamente",
    });
  } catch (error) {
    console.error(
      `Error al eliminar miembro del equipo ${req.params.id}:`,
      error.message
    );
    res.status(500).json({
      success: false,
      message: "Error al eliminar miembro del equipo",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

// Controlador para obtener los miembros de un equipo
exports.getTeamMembers = async (req, res) => {
  try {
    const teamId = req.params.id;

    // Verificar si el equipo existe
    const team = await Team.getTeamById(teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Equipo no encontrado",
      });
    }

    // Verificar permisos (solo admin o miembros del equipo pueden ver los miembros)
    if (req.user.role !== "admin") {
      const isMember = await Team.isTeamMember(teamId, req.user.id);
      if (!isMember) {
        return res.status(403).json({
          success: false,
          message: "No tienes permiso para ver los miembros de este equipo",
        });
      }
    }

    // Obtener miembros del equipo
    const members = await Team.getTeamMembers(teamId);

    res.status(200).json({
      success: true,
      count: members.length,
      members,
    });
  } catch (error) {
    console.error(
      `Error al obtener miembros del equipo ${req.params.id}:`,
      error.message
    );
    res.status(500).json({
      success: false,
      message: "Error al obtener miembros del equipo",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};
