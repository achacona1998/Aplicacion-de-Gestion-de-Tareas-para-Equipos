const Task = require("../models/taskModel");
const Project = require("../models/projectModel");
const User = require("../models/userModel");

/**
 * Obtiene un reporte de productividad por usuario
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 */
exports.getUserProductivityReport = async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;

    // Verificar permisos (solo el propio usuario o un admin pueden ver el reporte)
    if (req.user.role !== "admin" && req.user.id !== parseInt(userId)) {
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para ver este reporte",
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

    // Obtener tareas completadas por el usuario en el rango de fechas
    const tasks = await Task.getTasksByUserAndDateRange(
      userId,
      startDate,
      endDate
    );

    // Calcular métricas de productividad
    const completedTasks = tasks.filter((task) => task.status === "completada");
    const inProgressTasks = tasks.filter(
      (task) => task.status === "en_progreso"
    );
    const pendingTasks = tasks.filter((task) => task.status === "pendiente");

    // Calcular tiempo promedio de completado (en días)
    let avgCompletionTime = 0;
    if (completedTasks.length > 0) {
      const completionTimes = completedTasks.map((task) => {
        const createdDate = new Date(task.created_at);
        const updatedDate = new Date(task.updated_at);
        return (updatedDate - createdDate) / (1000 * 60 * 60 * 24); // Convertir a días
      });
      avgCompletionTime =
        completionTimes.reduce((sum, time) => sum + time, 0) /
        completedTasks.length;
    }

    // Calcular tareas completadas por prioridad
    const completedByPriority = {
      baja: completedTasks.filter((task) => task.priority === "baja").length,
      media: completedTasks.filter((task) => task.priority === "media").length,
      alta: completedTasks.filter((task) => task.priority === "alta").length,
      urgente: completedTasks.filter((task) => task.priority === "urgente")
        .length,
    };

    // Calcular tasa de completado
    const completionRate =
      tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;

    // Preparar reporte
    const report = {
      userId,
      username: user.username,
      period: {
        startDate: startDate || "All time",
        endDate: endDate || "Present",
      },
      metrics: {
        totalTasks: tasks.length,
        completedTasks: completedTasks.length,
        inProgressTasks: inProgressTasks.length,
        pendingTasks: pendingTasks.length,
        completionRate: completionRate.toFixed(2) + "%",
        avgCompletionTime: avgCompletionTime.toFixed(2) + " días",
        completedByPriority,
      },
    };

    res.status(200).json({
      success: true,
      report,
    });
  } catch (error) {
    console.error("Error al generar reporte de productividad:", error.message);
    res.status(500).json({
      success: false,
      message: "Error al generar reporte de productividad",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

/**
 * Obtiene un reporte de productividad por proyecto
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 */
exports.getProjectProductivityReport = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Verificar si el proyecto existe
    const project = await Project.getProjectById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Proyecto no encontrado",
      });
    }

    // Verificar permisos
    if (req.user.role !== "admin" && project.owner_id !== req.user.id) {
      // Aquí se podría verificar si el usuario es miembro del equipo del proyecto
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para ver este reporte",
      });
    }

    // Obtener tareas del proyecto
    const tasks = await Task.getTasksByProject(projectId);

    // Calcular métricas de productividad
    const completedTasks = tasks.filter((task) => task.status === "completada");
    const inProgressTasks = tasks.filter(
      (task) => task.status === "en_progreso"
    );
    const pendingTasks = tasks.filter((task) => task.status === "pendiente");
    const reviewTasks = tasks.filter((task) => task.status === "en_revision");

    // Calcular progreso del proyecto
    const projectProgress =
      tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;

    // Calcular distribución de tareas por usuario
    const tasksByUser = {};
    for (const task of tasks) {
      if (task.assignee_id) {
        if (!tasksByUser[task.assignee_id]) {
          const user = await User.getUserById(task.assignee_id);
          tasksByUser[task.assignee_id] = {
            username: user ? user.username : "Unknown",
            total: 0,
            completed: 0,
          };
        }
        tasksByUser[task.assignee_id].total++;
        if (task.status === "completada") {
          tasksByUser[task.assignee_id].completed++;
        }
      }
    }

    // Calcular tareas por prioridad
    const tasksByPriority = {
      baja: tasks.filter((task) => task.priority === "baja").length,
      media: tasks.filter((task) => task.priority === "media").length,
      alta: tasks.filter((task) => task.priority === "alta").length,
      urgente: tasks.filter((task) => task.priority === "urgente").length,
    };

    // Preparar reporte
    const report = {
      projectId,
      projectName: project.name,
      startDate: project.start_date,
      endDate: project.end_date,
      metrics: {
        totalTasks: tasks.length,
        completedTasks: completedTasks.length,
        inProgressTasks: inProgressTasks.length,
        pendingTasks: pendingTasks.length,
        reviewTasks: reviewTasks.length,
        projectProgress: projectProgress.toFixed(2) + "%",
        tasksByPriority,
        tasksByUser,
      },
    };

    res.status(200).json({
      success: true,
      report,
    });
  } catch (error) {
    console.error(
      "Error al generar reporte de productividad del proyecto:",
      error.message
    );
    res.status(500).json({
      success: false,
      message: "Error al generar reporte de productividad del proyecto",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

/**
 * Obtiene un análisis de carga de trabajo por usuario
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 */
exports.getWorkloadAnalysis = async (req, res) => {
  try {
    // Solo administradores pueden ver el análisis de carga de trabajo de todos los usuarios
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para ver este análisis",
      });
    }

    // Obtener todos los usuarios
    const users = await User.getAllUsers();

    // Preparar análisis de carga de trabajo
    const workloadAnalysis = [];

    for (const user of users) {
      // Obtener tareas asignadas al usuario
      const tasks = await Task.getTasksByUser(user.id);

      // Calcular métricas de carga de trabajo
      const pendingTasks = tasks.filter(
        (task) => task.status === "pendiente"
      ).length;
      const inProgressTasks = tasks.filter(
        (task) => task.status === "en_progreso"
      ).length;
      const urgentTasks = tasks.filter(
        (task) =>
          task.priority === "urgente" &&
          (task.status === "pendiente" || task.status === "en_progreso")
      ).length;

      // Calcular nivel de carga de trabajo
      let workloadLevel = "normal";
      const totalActiveTasks = pendingTasks + inProgressTasks;

      if (totalActiveTasks > 10 || urgentTasks > 3) {
        workloadLevel = "alto";
      } else if (totalActiveTasks > 5 || urgentTasks > 1) {
        workloadLevel = "medio";
      } else if (totalActiveTasks === 0) {
        workloadLevel = "bajo";
      }

      workloadAnalysis.push({
        userId: user.id,
        username: user.username,
        metrics: {
          totalActiveTasks,
          pendingTasks,
          inProgressTasks,
          urgentTasks,
          workloadLevel,
        },
      });
    }

    res.status(200).json({
      success: true,
      workloadAnalysis,
    });
  } catch (error) {
    console.error(
      "Error al generar análisis de carga de trabajo:",
      error.message
    );
    res.status(500).json({
      success: false,
      message: "Error al generar análisis de carga de trabajo",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};
