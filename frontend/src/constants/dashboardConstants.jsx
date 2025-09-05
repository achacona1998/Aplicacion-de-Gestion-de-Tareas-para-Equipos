import { TriangleAlert, CircleCheck, List, Clock } from "lucide-react";

/**
 * Constantes para el dashboard
 */

/**
 * Configuración de las tarjetas de estadísticas
 * @param {Object} stats - Estadísticas de tareas
 * @param {String} taskSelected - Tipo de tarea seleccionada
 * @returns {Array} Configuración de tarjetas 
 */
export const getStatCards = (stats, taskSelected) => [
  {
    id: "totales",
    title: "Tareas Totales",
    stat: stats.total,
    icon: <List className="text-blue-700 stroke-2 " />,
  },
  {
    id: "completadas",
    title: "Tareas Completadas",
    stat: stats.completed,
    icon: (
      <CircleCheck
        className={`stroke-2 ${taskSelected === "completadas" ? "text-blue-700" : "text-green-600"}`}
      />
    ),
  },
  {
    id: "pendientes",
    title: "Tareas Pendientes",
    stat: stats.pending,
    icon: (
      <Clock
        className={`stroke-2 ${taskSelected === "pendientes" ? "text-blue-700" : "text-amber-500"}`}
      />
    ),
  },
  {
    id: "urgentes",
    title: "Tareas Urgentes",
    stat: stats.urgent,
    icon: (
      <TriangleAlert
        className={`stroke-2 ${taskSelected === "urgentes" ? "text-blue-700" : "text-red-600"}`}
      />
    ),
  },
];

/**
 * Obtiene las clases CSS para la prioridad de una tarea
 * @param {String} priority - Prioridad de la tarea
 * @returns {String} Clases CSS
 */
export const getPriorityClasses = (priority) => {
  switch (priority) {
    case "baja":
      return "text-green-800";
    case "media":
      return "text-blue-800";
    case "alta":
      return "text-yellow-800";
    case "urgente":
      return "text-red-800";
    default:
      return "text-gray-800";
  }
};

/**
 * Obtiene las clases CSS para el estado de una tarea
 * @param {String} status - Estado de la tarea
 * @returns {String} Clases CSS
 */
export const getStatusClasses = (status) => {
  switch (status) {
    case "completada":
      return "text-green-800";
    case "en_progreso":
      return "text-blue-800";
    case "pendiente":
      return "text-yellow-800";
    case "cancelada":
      return "text-red-800";
    default:
      return "text-gray-800";
  }
};

/**
 * Formatea el texto del estado de una tarea
 * @param {String} status - Estado de la tarea
 * @returns {String} Texto formateado
 */
export const formatStatusText = (status) => {
  switch (status) {
    case "en_progreso":
      return "En Progreso";
    case "en_revision":
      return "En Revisión";
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
};