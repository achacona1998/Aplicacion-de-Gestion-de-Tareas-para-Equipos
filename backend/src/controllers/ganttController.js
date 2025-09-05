const Task = require("../models/taskModel");
const Project = require("../models/projectModel");

/**
 * Obtiene los datos para el diagrama de Gantt de todos los proyectos
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 */
exports.getProjectsGanttData = async (req, res) => {
  try {
    // Obtener proyectos según el rol del usuario
    let projects;
    if (req.user.role === "admin") {
      projects = await Project.getAllProjects();
    } else {
      projects = await Project.getProjectsByUser(req.user.id);
    }

    // Formatear datos para el diagrama de Gantt
    const ganttData = projects.map((project) => ({
      id: `project-${project.id}`,
      name: project.name,
      start: project.start_date,
      end: project.end_date || new Date(), // Si no hay fecha de fin, usar fecha actual
      progress: calculateProjectProgress(project),
      type: "project",
      hideChildren: false,
      displayOrder: 1,
    }));

    res.status(200).json({
      success: true,
      ganttData,
    });
  } catch (error) {
    console.error(
      "Error al obtener datos de Gantt para proyectos:",
      error.message
    );
    res.status(500).json({
      success: false,
      message: "Error al obtener datos de Gantt para proyectos",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

/**
 * Obtiene los datos para el diagrama de Gantt de un proyecto específico con sus tareas
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 */
exports.getProjectGanttData = async (req, res) => {
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

    // Verificar acceso al proyecto
    if (req.user.role !== "admin" && project.owner_id !== req.user.id) {
      // Aquí se podría verificar si el usuario es miembro del equipo del proyecto
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para acceder a este proyecto",
      });
    }

    // Obtener tareas del proyecto
    const tasks = await Task.getTasksByProject(projectId);

    // Formatear datos para el diagrama de Gantt
    const ganttData = [
      // Datos del proyecto
      {
        id: `project-${project.id}`,
        name: project.name,
        start: project.start_date,
        end: project.end_date || new Date(),
        progress: calculateProjectProgress(project),
        type: "project",
        hideChildren: false,
        displayOrder: 1,
      },
      // Datos de las tareas
      ...tasks.map((task, index) => ({
        id: `task-${task.id}`,
        name: task.title,
        start: task.due_date
          ? new Date(
              new Date(task.due_date).getTime() - 7 * 24 * 60 * 60 * 1000
            )
          : project.start_date, // Estimar fecha de inicio 1 semana antes
        end: task.due_date || project.end_date || new Date(),
        progress: calculateTaskProgress(task),
        type: "task",
        project: `project-${project.id}`,
        displayOrder: index + 2,
      })),
    ];

    res.status(200).json({
      success: true,
      ganttData,
    });
  } catch (error) {
    console.error(
      "Error al obtener datos de Gantt para el proyecto:",
      error.message
    );
    res.status(500).json({
      success: false,
      message: "Error al obtener datos de Gantt para el proyecto",
      error: process.env.NODE_ENV === "development" ? error.message : {},
    });
  }
};

/**
 * Calcula el progreso de un proyecto basado en sus tareas
 * @param {Object} project - Objeto del proyecto
 * @returns {number} Porcentaje de progreso (0-100)
 */
const calculateProjectProgress = async (project) => {
  try {
    // Obtener todas las tareas del proyecto
    const tasks = await Task.getTasksByProject(project.id);

    if (tasks.length === 0) return 0;

    // Contar tareas completadas
    const completedTasks = tasks.filter(
      (task) => task.status === "completada"
    ).length;

    // Calcular porcentaje
    return Math.round((completedTasks / tasks.length) * 100);
  } catch (error) {
    console.error("Error al calcular progreso del proyecto:", error.message);
    return 0;
  }
};

/**
 * Calcula el progreso de una tarea basado en su estado
 * @param {Object} task - Objeto de la tarea
 * @returns {number} Porcentaje de progreso (0-100)
 */
const calculateTaskProgress = (task) => {
  switch (task.status) {
    case "completada":
      return 100;
    case "en_revision":
      return 75;
    case "en_progreso":
      return 50;
    case "pendiente":
      return 0;
    case "cancelada":
      return 0;
    default:
      return 0;
  }
};
