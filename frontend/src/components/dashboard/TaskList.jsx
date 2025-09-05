import React from "react";
import { formatDate } from "../../utils/dateUtils";
import {
  formatStatusText,
  getPriorityClasses,
  getStatusClasses,
} from "../../constants/dashboardConstants";

/**
 * Componente para mostrar la lista de tareas filtradas en el dashboard
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.tasks - Lista de tareas
 * @param {String} props.taskSelected - Tipo de tarea seleccionada
 * @returns {React.ReactElement} Componente de lista de tareas
 */
const TaskList = ({ tasks, taskSelected }) => {
  // Filtrar tareas según la selección
  const filteredTasks = React.useMemo(() => {
    if (!Array.isArray(tasks)) return [];

    switch (taskSelected) {
      case "completadas":
        return tasks.filter((task) => task.status === "completada");
      case "pendientes":
        return tasks.filter(
          (task) => task.status === "pendiente" || task.status === "en_progreso"
        );
      case "urgentes":
        return tasks.filter((task) => task.priority === "urgente");
      default:
        return tasks;
    }
  }, [tasks, taskSelected]);

  if (!filteredTasks.length) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">
          Tareas {taskSelected !== "totales" ? taskSelected : ""}
        </h2>
        <p className="text-gray-500">No hay tareas para mostrar</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        Tareas {taskSelected !== "totales" ? taskSelected : ""}
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tarea
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prioridad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTasks.map((task) => (
              <tr key={task.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {task.title}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {formatDate(task.due_date)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-opacity-10 ${getPriorityClasses(
                      task.priority
                    )}`}>
                    {task.priority.charAt(0).toUpperCase() +
                      task.priority.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-opacity-10 ${getStatusClasses(
                      task.status
                    )}`}>
                    {formatStatusText(task.status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskList;
