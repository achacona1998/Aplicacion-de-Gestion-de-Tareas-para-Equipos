/**
 * Utilidades para el manejo de fechas
 */

/**
 * Formatea una fecha en formato legible
 * @param {String} dateString - Fecha en formato string
 * @returns {String} Fecha formateada
 */
export const formatDate = (dateString) => {
  if (!dateString) return "Sin fecha";
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * Genera una etiqueta descriptiva para la fecha de vencimiento
 * @param {String} dueDate - Fecha de vencimiento
 * @param {String} createdAt - Fecha de creación
 * @returns {String} Etiqueta descriptiva
 */
export const getDueDateLabel = (dueDate, createdAt) => {
  if (!dueDate) return "Sin fecha";

  const now = new Date();
  const due = new Date(dueDate);

  // Calcula diferencia en días (ignorando la hora)
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const startOfDue = new Date(
    due.getFullYear(),
    due.getMonth(),
    due.getDate()
  );
  const diffMs = startOfDue - startOfToday;
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  // Hora de referencia: la hora de creación de la tarea
  let hourLabel = "";
  if (createdAt) {
    const created = new Date(createdAt);
    const hours = created.getHours().toString().padStart(2, "0");
    const minutes = created.getMinutes().toString().padStart(2, "0");
    hourLabel = ` a las ${hours}:${minutes}`;
  }

  if (diffDays === 0) return `Vence hoy${hourLabel}`;
  if (diffDays === 1) return `Vence mañana${hourLabel}`;
  if (diffDays > 1 && diffDays <= 7)
    return `Vence en ${diffDays} días${hourLabel}`;
  if (diffDays < 0)
    return `Venció hace ${Math.abs(diffDays)} días${hourLabel}`;

  // Si no es ninguna de las anteriores, muestra la fecha formateada
  return (
    due.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }) + hourLabel
  );
};

/**
 * Organiza las tareas por fecha de vencimiento
 * @param {Array} tasks - Lista de tareas
 * @returns {Object} Mapa de tareas organizadas por fecha
 */
export const organizeDueDates = (tasks) => {
  if (!Array.isArray(tasks)) {
    console.error("organizeDueDates: tasks no es un array", tasks);
    return {};
  }
  
  const dueDatesMap = {};
  tasks.forEach((task) => {
    if (task.due_date) {
      const dateKey = new Date(task.due_date).toISOString().slice(0, 10); // 'YYYY-MM-DD'
      if (!dueDatesMap[dateKey]) dueDatesMap[dateKey] = [];
      dueDatesMap[dateKey].push(task);
    }
  });
  return dueDatesMap;
};