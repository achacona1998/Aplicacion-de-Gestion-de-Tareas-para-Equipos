const Task = require("../models/taskModel");
const Project = require("../models/projectModel");

/**
 * Obtiene las tareas organizadas en formato de tablero Kanban
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 */
exports.getKanbanBoard = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Verificar si el proyecto existe
    if (projectId) {
      const project = await Project.getProjectById(projectId);
      if (!project) {
        return res.status(404).json({
          success: false,
          message: "Proyecto no encontrado",
        });
      }

      // Verificar acceso al proyecto
      if (req.user.role !== "admin" && project.owner_id !== req.user.id) {
        // Aquí se podría verificar si el usuario es miembro del equipo del proyecto
        return res.status(403).json({
          success: false,
          message: "No tienes permiso para acceder a este proyecto",
        });
      }
    }

    // Obtener tareas según el filtro (proyecto o todas)
    let tasks;
    if (projectId) {
      tasks = await Task.getTasksByProject(projectId);
    } else if (req.user.role === "admin") {
      tasks = await Task.getAllTasks();
    } else {
      tasks = await Task.getTasksByUser(req.user.id);
    }

    // Organizar tareas por estado (columnas del Kanban)
    const kanbanBoard = {
      pendiente: tasks.filter((task) => task.status === "pendiente"),
      en_progreso: tasks.filter((task) => task.status === "en_progreso"),
      en_revision: tasks.filter((task) => task.status === "en_revision"),
      completada: tasks.filter((task) => task.status === "completada"),
      cancelada: tasks.filter((task) => task.status === "cancelada"),
    };

    res.status(200).json({
      success: true,
      kanbanBoard,
    });
  } catch (error) {
    console.error("Error al obtener tablero Kanban:", error.message);
    res.status(500).json({
      success: false,
      message: "Error al obtener tablero Kanban",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

/**
 * Mueve una tarea de una columna a otra en el tablero Kanban
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 */
exports.moveTaskInKanban = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { newStatus } = req.body;

    // Validar el nuevo estado
    const validStatuses = [
      "pendiente",
      "en_progreso",
      "en_revision",
      "completada",
      "cancelada",
    ];
    if (!validStatuses.includes(newStatus)) {
      return res.status(400).json({
        success: false,
        message: "Estado no válido",
      });
    }

    // Obtener la tarea
    const task = await Task.getTaskById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Tarea no encontrada",
      });
    }

    // Verificar permisos
    if (
      req.user.role !== "admin" &&
      task.assignee_id !== req.user.id &&
      task.created_by !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para mover esta tarea",
      });
    }

    // Actualizar el estado de la tarea
    const updated = await Task.updateTaskStatus(taskId, newStatus);
    if (!updated) {
      return res.status(400).json({
        success: false,
        message: "No se pudo actualizar el estado de la tarea",
      });
    }

    res.status(200).json({
      success: true,
      message: "Tarea movida exitosamente",
      task: {
        ...task,
        status: newStatus,
      },
    });
  } catch (error) {
    console.error("Error al mover tarea en Kanban:", error.message);
    res.status(500).json({
      success: false,
      message: "Error al mover tarea en Kanban",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};
