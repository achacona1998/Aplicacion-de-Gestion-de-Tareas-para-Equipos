const Project = require("../models/projectModel");
const Team = require("../models/teamModel");

// Controlador para obtener todos los proyectos
exports.getAllProjects = async (req, res) => {
  try {
    // Si el usuario no es admin, solo obtener proyectos relacionados con él
    let projects;
    if (req.user.role === "admin") {
      projects = await Project.getAllProjects();
    } else {
      // Obtener proyectos creados por el usuario
      projects = await Project.getProjectsByUser(req.user.id);
    }

    res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    console.error("Error al obtener proyectos:", error.message);
    res.status(500).json({
      success: false,
      message: "Error al obtener proyectos",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

// Controlador para obtener proyectos del usuario actual
exports.getMyProjects = async (req, res) => {
  try {
    const userId = req.user.id;
    const projects = await Project.getProjectsByUser(userId);

    res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    console.error(
      `Error al obtener proyectos del usuario ${req.user.id}:`,
      error.message
    );
    res.status(500).json({
      success: false,
      message: "Error al obtener tus proyectos",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

// Controlador para obtener proyectos por equipo
exports.getProjectsByTeam = async (req, res) => {
  try {
    const teamId = req.params.teamId;

    // Verificar si el equipo existe
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
          message: "No tienes permiso para ver los proyectos de este equipo",
        });
      }
    }

    const projects = await Project.getProjectsByTeam(teamId);

    res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    console.error(
      `Error al obtener proyectos del equipo ${req.params.teamId}:`,
      error.message
    );
    res.status(500).json({
      success: false,
      message: "Error al obtener proyectos del equipo",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

// Controlador para obtener un proyecto por ID
exports.getProjectById = async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await Project.getProjectById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Proyecto no encontrado",
      });
    }

    // Verificar si el usuario tiene acceso al proyecto
    if (req.user.role !== "admin" && project.owner_id !== req.user.id) {
      // Verificar si el usuario es miembro del equipo del proyecto
      if (project.team_id) {
        const isMember = await Team.isTeamMember(project.team_id, req.user.id);
        if (!isMember) {
          return res.status(403).json({
            success: false,
            message: "No tienes permiso para ver este proyecto",
          });
        }
      } else {
        return res.status(403).json({
          success: false,
          message: "No tienes permiso para ver este proyecto",
        });
      }
    }

    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    console.error(`Error al obtener proyecto ${req.params.id}:`, error.message);
    res.status(500).json({
      success: false,
      message: "Error al obtener proyecto",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

// Controlador para crear un nuevo proyecto
exports.createProject = async (req, res) => {
  try {
    const { name, description, start_date, end_date, status, team_id } =
      req.body;

    // Validar datos de entrada
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "El nombre del proyecto es obligatorio",
      });
    }

    // Si se especifica un equipo, verificar si existe y si el usuario tiene acceso
    if (team_id) {
      const team = await Team.getTeamById(team_id);
      if (!team) {
        return res.status(404).json({
          success: false,
          message: "Equipo no encontrado",
        });
      }

      // Verificar si el usuario es miembro del equipo
      if (req.user.role !== "admin") {
        const isMember = await Team.isTeamMember(team_id, req.user.id);
        if (!isMember) {
          return res.status(403).json({
            success: false,
            message: "No tienes permiso para crear proyectos en este equipo",
          });
        }
      }
    }

    // Crear proyecto
    const projectData = {
      name,
      description,
      start_date,
      end_date,
      status: status || "pendiente",
      owner_id: req.user.id,
      team_id,
    };

    const projectId = await Project.createProject(projectData);

    res.status(201).json({
      success: true,
      message: "Proyecto creado correctamente",
      projectId,
    });
  } catch (error) {
    console.error("Error al crear proyecto:", error.message);
    res.status(500).json({
      success: false,
      message: "Error al crear proyecto",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

// Controlador para actualizar un proyecto
exports.updateProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const { name, description, start_date, end_date, status, team_id } =
      req.body;

    // Verificar si el proyecto existe
    const project = await Project.getProjectById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Proyecto no encontrado",
      });
    }

    // Verificar si el usuario tiene permiso para actualizar el proyecto
    if (req.user.role !== "admin" && project.owner_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para actualizar este proyecto",
      });
    }

    // Si se cambia el equipo, verificar si existe y si el usuario tiene acceso
    if (team_id && team_id !== project.team_id) {
      const team = await Team.getTeamById(team_id);
      if (!team) {
        return res.status(404).json({
          success: false,
          message: "Equipo no encontrado",
        });
      }

      // Verificar si el usuario es miembro del equipo
      if (req.user.role !== "admin") {
        const isMember = await Team.isTeamMember(team_id, req.user.id);
        if (!isMember) {
          return res.status(403).json({
            success: false,
            message: "No tienes permiso para asignar el proyecto a este equipo",
          });
        }
      }
    }

    // Actualizar proyecto
    const projectData = {
      name: name || project.name,
      description:
        description !== undefined ? description : project.description,
      start_date: start_date || project.start_date,
      end_date: end_date || project.end_date,
      status: status || project.status,
      owner_id: project.owner_id,
      team_id: team_id !== undefined ? team_id : project.team_id,
    };

    const updated = await Project.updateProject(projectId, projectData);

    if (!updated) {
      return res.status(400).json({
        success: false,
        message: "No se pudo actualizar el proyecto",
      });
    }

    res.status(200).json({
      success: true,
      message: "Proyecto actualizado correctamente",
    });
  } catch (error) {
    console.error(
      `Error al actualizar proyecto ${req.params.id}:`,
      error.message
    );
    res.status(500).json({
      success: false,
      message: "Error al actualizar proyecto",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

// Controlador para eliminar un proyecto
exports.deleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;

    // Verificar si el proyecto existe
    const project = await Project.getProjectById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Proyecto no encontrado",
      });
    }

    // Verificar si el usuario tiene permiso para eliminar el proyecto
    if (req.user.role !== "admin" && project.owner_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para eliminar este proyecto",
      });
    }

    // Eliminar proyecto
    const deleted = await Project.deleteProject(projectId);

    if (!deleted) {
      return res.status(400).json({
        success: false,
        message: "No se pudo eliminar el proyecto",
      });
    }

    res.status(200).json({
      success: true,
      message: "Proyecto eliminado correctamente",
    });
  } catch (error) {
    console.error(
      `Error al eliminar proyecto ${req.params.id}:`,
      error.message
    );
    res.status(500).json({
      success: false,
      message: "Error al eliminar proyecto",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};
