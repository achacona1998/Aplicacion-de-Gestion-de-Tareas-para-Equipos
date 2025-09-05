const Task = require("../models/taskModel");
const Project = require("../models/projectModel");

// Controlador para obtener todas las tareas
exports.getAllTasks = async (req, res) => {
  try {
    // Si el usuario no es admin, solo obtener tareas relacionadas con él
    let tasks;
    if (req.user.role === "admin") {
      tasks = await Task.getAllTasks();
    } else {
      // Obtener tareas asignadas al usuario o creadas por él
      const assignedTasks = await Task.getTasksByUser(req.user.id);
      tasks = assignedTasks;
    }

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    console.error("Error al obtener tareas:", error.message);
    res.status(500).json({
      success: false,
      message: "Error al obtener tareas",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

// Controlador para obtener tareas por proyecto
exports.getTasksByProject = async (req, res) => {
  try {
    const projectId = req.params.projectId;

    // Verificar si el proyecto existe
    const project = await Project.getProjectById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Proyecto no encontrado",
      });
    }

    // Verificar si el usuario tiene acceso al proyecto
    if (req.user.role !== "admin" && project.owner_id !== req.user.id) {
      // Aquí se podría verificar si el usuario es miembro del equipo del proyecto
      // Por ahora, simplemente verificamos si es el propietario
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para acceder a este proyecto",
      });
    }

    const tasks = await Task.getTasksByProject(projectId);

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    console.error(
      `Error al obtener tareas del proyecto ${req.params.projectId}:`,
      error.message
    );
    res.status(500).json({
      success: false,
      message: "Error al obtener tareas del proyecto",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

// Controlador para obtener tareas asignadas al usuario actual
exports.getMyTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const tasks = await Task.getTasksByUser(userId);

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    console.error(
      `Error al obtener tareas del usuario ${req.user.id}:`,
      error.message
    );
    res.status(500).json({
      success: false,
      message: "Error al obtener tus tareas",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

// Controlador para obtener una tarea por ID
exports.getTaskById = async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await Task.getTaskById(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Tarea no encontrada",
      });
    }

    // Verificar si el usuario tiene acceso a la tarea
    if (
      req.user.role !== "admin" &&
      task.assignee_id !== req.user.id &&
      task.created_by !== req.user.id
    ) {
      // Aquí se podría verificar si el usuario es miembro del equipo del proyecto
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para acceder a esta tarea",
      });
    }

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    console.error(
      `Error al obtener tarea con ID ${req.params.id}:`,
      error.message
    );
    res.status(500).json({
      success: false,
      message: "Error al obtener tarea",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

// Controlador para crear una nueva tarea
exports.createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      due_date,
      assignee_id,
      project_id,
    } = req.body;

    // Verificar si el proyecto existe
    if (project_id) {
      const project = await Project.getProjectById(project_id);
      if (!project) {
        return res.status(404).json({
          success: false,
          message: "Proyecto no encontrado",
        });
      }

      // Verificar si el usuario tiene permiso para crear tareas en este proyecto
      if (req.user.role !== "admin" && project.owner_id !== req.user.id) {
        // Aquí se podría verificar si el usuario es miembro del equipo del proyecto
        return res.status(403).json({
          success: false,
          message: "No tienes permiso para crear tareas en este proyecto",
        });
      }
    }

    // Crear tarea
    const taskId = await Task.createTask({
      title,
      description,
      status: status || "pendiente",
      priority: priority || "media",
      due_date,
      assignee_id,
      project_id,
      created_by: req.user.id,
    });

    // Obtener la tarea creada
    const task = await Task.getTaskById(taskId);

    res.status(201).json({
      success: true,
      message: "Tarea creada exitosamente",
      task,
    });
  } catch (error) {
    console.error("Error al crear tarea:", error.message);
    res.status(500).json({
      success: false,
      message: "Error al crear tarea",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

// Controlador para actualizar una tarea
exports.updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const {
      title,
      description,
      status,
      priority,
      due_date,
      assignee_id,
      project_id,
    } = req.body;

    // Verificar si la tarea existe
    const task = await Task.getTaskById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Tarea no encontrada",
      });
    }

    // Verificar si el usuario tiene permiso para actualizar la tarea
    if (
      req.user.role !== "admin" &&
      task.created_by !== req.user.id &&
      task.assignee_id !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para actualizar esta tarea",
      });
    }

    // Si se cambia el proyecto, verificar si el nuevo proyecto existe
    if (project_id && project_id !== task.project_id) {
      const project = await Project.getProjectById(project_id);
      if (!project) {
        return res.status(404).json({
          success: false,
          message: "Proyecto no encontrado",
        });
      }

      // Verificar si el usuario tiene permiso para mover tareas a este proyecto
      if (req.user.role !== "admin" && project.owner_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "No tienes permiso para mover tareas a este proyecto",
        });
      }
    }

    // Actualizar tarea
    const updated = await Task.updateTask(taskId, {
      title,
      description,
      status,
      priority,
      due_date,
      assignee_id,
      project_id,
    });

    if (!updated) {
      return res.status(400).json({
        success: false,
        message: "No se pudo actualizar la tarea",
      });
    }

    // Obtener la tarea actualizada
    const updatedTask = await Task.getTaskById(taskId);

    res.status(200).json({
      success: true,
      message: "Tarea actualizada exitosamente",
      task: updatedTask,
    });
  } catch (error) {
    console.error(
      `Error al actualizar tarea con ID ${req.params.id}:`,
      error.message
    );
    res.status(500).json({
      success: false,
      message: "Error al actualizar tarea",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

// Controlador para actualizar el estado de una tarea
exports.updateTaskStatus = async (req, res) => {
  try {
    const taskId = req.params.id;
    const { status } = req.body;

    // Verificar si la tarea existe
    const task = await Task.getTaskById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Tarea no encontrada",
      });
    }

    // Verificar si el usuario tiene permiso para actualizar la tarea
    if (
      req.user.role !== "admin" &&
      task.created_by !== req.user.id &&
      task.assignee_id !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para actualizar esta tarea",
      });
    }

    // Actualizar estado de la tarea
    const updated = await Task.updateTaskStatus(taskId, status);

    if (!updated) {
      return res.status(400).json({
        success: false,
        message: "No se pudo actualizar el estado de la tarea",
      });
    }

    // Obtener la tarea actualizada
    const updatedTask = await Task.getTaskById(taskId);

    res.status(200).json({
      success: true,
      message: "Estado de tarea actualizado exitosamente",
      task: updatedTask,
    });
  } catch (error) {
    console.error(
      `Error al actualizar estado de tarea con ID ${req.params.id}:`,
      error.message
    );
    res.status(500).json({
      success: false,
      message: "Error al actualizar estado de tarea",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

// Controlador para eliminar una tarea
exports.deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;

    // Verificar si la tarea existe
    const task = await Task.getTaskById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Tarea no encontrada",
      });
    }

    // Verificar si el usuario tiene permiso para eliminar la tarea
    if (req.user.role !== "admin" && task.created_by !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para eliminar esta tarea",
      });
    }

    // Eliminar tarea
    const deleted = await Task.deleteTask(taskId);

    if (!deleted) {
      return res.status(400).json({
        success: false,
        message: "No se pudo eliminar la tarea",
      });
    }

    res.status(200).json({
      success: true,
      message: "Tarea eliminada exitosamente",
    });
  } catch (error) {
    console.error(
      `Error al eliminar tarea con ID ${req.params.id}:`,
      error.message
    );
    res.status(500).json({
      success: false,
      message: "Error al eliminar tarea",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};
