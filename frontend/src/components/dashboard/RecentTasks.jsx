import React from 'react';
import { Link } from 'react-router-dom';
import { getDueDateLabel } from '../../utils/dateUtils';
import { getPriorityClasses, getStatusClasses, formatStatusText } from '../../constants/dashboardConstants';

/**
 * Componente para mostrar las tareas recientes en el dashboard
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.tasks - Lista de tareas
 * @param {String} props.taskSelected - Tipo de tarea seleccionada
 * @returns {React.ReactElement} Componente de tareas recientes
 */
const RecentTasks = ({ tasks, taskSelected }) => {
  // Filtrar tareas según la selección
  const filteredTasks = React.useMemo(() => {
    if (!Array.isArray(tasks)) return [];
    
    let filtered = [];
    switch (taskSelected) {
      case 'completadas':
        filtered = tasks.filter(task => task.status === 'completada');
        break;
      case 'pendientes':
        filtered = tasks.filter(task => task.status === 'pendiente' || task.status === 'en_progreso');
        break;
      case 'urgentes':
        filtered = tasks.filter(task => task.priority === 'urgente' || task.priority === 'alta');
        break;
      default:
        filtered = tasks;
    }
    
    // Mostrar solo las 4 más recientes
    return filtered.slice(0, 4);
  }, [tasks, taskSelected]);

  const title = React.useMemo(() => {
    switch (taskSelected) {
      case 'completadas':
        return 'Tareas Completadas';
      case 'pendientes':
        return 'Tareas Pendientes';
      case 'urgentes':
        return 'Tareas Urgentes';
      default:
        return 'Tareas Totales';
    }
  }, [taskSelected]);

  return (
    <div className="bg-white px-4 py-5 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      {filteredTasks.length === 0 ? (
        <p className="text-gray-500">No hay tareas para mostrar.</p>
      ) : (
        <ul className="space-y-2">
          {filteredTasks.map((task) => (
            <Link
              key={task.id}
              to={`/tasks/${task.id}`}
              className="px-3 py-4 gap-1 border border-gray-100 rounded shadow flex hover:border-blue-800 transition-colors duration-300 flex-col"
            >
              <div className="font-semibold">{task.title}</div>
              <div className="text-sm text-gray-500">
                {getDueDateLabel(task.due_date, task.created_at)}
              </div>

              <div className="flex items-center">
                <span
                  className={`inline-flex text-sm leading-5 font-semibold rounded-full uppercase ${getPriorityClasses(task.priority)}`}
                >
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>
                <span
                  className={`px-2 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusClasses(task.status)}`}
                >
                  {formatStatusText(task.status)}
                </span>
              </div>
            </Link>
          ))}
        </ul>
      )}
      {/* Botón Ver más */}
      {tasks.length > 4 && (
        <div className="mt-4 text-right">
          <Link
            to="/tasks"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
          >
            Ver más
          </Link>
        </div>
      )}
    </div>
  );
};

export default RecentTasks;