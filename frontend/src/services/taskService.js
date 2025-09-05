import api from './api';

/**
 * Servicio para manejar las operaciones relacionadas con tareas
 */
export const fetchTasks = async (token) => {
  try {
    const response = await fetch("http://localhost:3000/api/v1/tasks", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error al cargar las tareas:", errorText);
      throw new Error("Error al cargar las tareas");
    }

    const data = await response.json();
    console.log("Tareas cargadas:", data);
    return data.tasks || [];
  } catch (err) {
    console.error("Error completo al cargar tareas:", err);
    throw err;
  }
};

/**
 * Calcula estadísticas de las tareas
 * @param {Array} tasks - Lista de tareas
 * @returns {Object} Estadísticas calculadas
 */
export const calculateTaskStats = (tasks) => {
  if (!Array.isArray(tasks)) {
    console.error("calculateTaskStats: tasks no es un array", tasks);
    return { total: 0, pending: 0, urgent: 0, completed: 0 };
  }

  const total = tasks.length || 0;
  const pending = tasks.filter((task) => task.status === "pendiente").length || 0;
  const urgent1 = tasks.filter((task) => task.priority === "urgente").length || 0;
  const alta = tasks.filter((task) => task.priority === "alta").length || 0;
  const urgent = urgent1 + alta;
  const completed = tasks.filter((task) => task.status === "completada").length || 0;

  return {
    total,
    pending,
    urgent,
    completed,
  };
};

/**
 * Filtra tareas según el tipo seleccionado
 * @param {Array} tasks - Lista de tareas
 * @param {String} taskType - Tipo de tareas a filtrar
 * @returns {Array} Tareas filtradas
 */
export const filterTasks = (tasks, taskType) => {
  if (!Array.isArray(tasks)) {
    console.error("filterTasks: tasks no es un array", tasks);
    return [];
  }

  switch (taskType) {
    case "completadas":
      return tasks.filter((t) => t.status === "completada");
    case "pendientes":
      return tasks.filter((t) => t.status === "pendiente");
    case "urgentes":
      return tasks.filter(
        (t) => t.priority === "urgente" || t.priority === "alta"
      );
    default:
      return tasks;
  }
};