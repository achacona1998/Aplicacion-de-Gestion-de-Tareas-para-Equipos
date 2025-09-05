import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Link } from "react-router-dom";

// Función auxiliar para mostrar la fecha de vencimiento de forma amigable
function getDueDateLabel(dueDate, createdAt) {
  if (!dueDate) return "Sin fecha";

  const now = new Date();
  const due = new Date(dueDate);

  // Calcula diferencia en días (ignorando la hora)
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const startOfDue = new Date(due.getFullYear(), due.getMonth(), due.getDate());
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
  if (diffDays < 0) return `Venció hace ${Math.abs(diffDays)} días${hourLabel}`;

  // Si no es ninguna de las anteriores, muestra la fecha formateada
  return (
    due.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }) + hourLabel
  );
}

// Componente del calendario con próximos eventos
const CalendarWithUpcoming = ({ tasks }) => {
  // Construye el mapa de fechas a tareas
  const dueDatesMap = {};
  tasks.forEach((task) => {
    if (task.due_date) {
      const dateKey = new Date(task.due_date).toISOString().slice(0, 10); // 'YYYY-MM-DD'
      if (!dueDatesMap[dateKey]) dueDatesMap[dateKey] = [];
      dueDatesMap[dateKey].push(task);
    }
  });

  const [hoveredDate, setHoveredDate] = useState(null);

  // Obtén los próximos eventos (tareas con due_date en el futuro, ordenadas)
  const upcomingTasks = tasks
    .filter((task) => task.due_date && new Date(task.due_date) >= new Date())
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
    .slice(0, 5); // Muestra los 5 más próximos

  return (
    <div className="row-span-2  bg-white p-4 rounded shadow relative flex flex-col items-center">
      <h3 className="text-lg font-bold mb-5 ">Calendario de vencimientos</h3>
      <Calendar
        tileClassName={({ date, view }) => {
          if (view === "month") {
            const dateKey = date.toISOString().slice(0, 10);
            if (dueDatesMap[dateKey]) {
              return "bg-yellow-200 border-yellow-500 border-2 rounded-full cursor-pointer";
            }
          }
          return "";
        }}
        tileContent={({ date, view }) => {
          if (view === "month") {
            const dateKey = date.toISOString().slice(0, 10);
            if (dueDatesMap[dateKey]) {
              return (
                <div
                  onMouseEnter={() => setHoveredDate(dateKey)}
                  onMouseLeave={() => setHoveredDate(null)}>
                  <span className="block mx-auto mt-1 w-2 h-2 bg-blue-600 rounded-full"></span>
                </div>
              );
            }
          }
          return null;
        }}
      />
      {/* Tooltip flotante */}
      {hoveredDate && dueDatesMap[hoveredDate] && (
        <div className="absolute left-1/2 -translate-x-1/2 mt-2 p-2 bg-gray-800 text-white rounded shadow-lg text-xs z-50 w-56">
          <div className="font-bold mb-1">Tareas para {hoveredDate}:</div>
          {dueDatesMap[hoveredDate].map((task) => (
            <div key={task.id} className="mb-1">
              <Link
                to={`/tasks/${task.id}`}
                className="hover:underline text-blue-200">
                {task.title}
              </Link>
              <div className="text-gray-300">
                {getDueDateLabel(task.due_date, task.created_at)}
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Próximos eventos */}
      <div className="mt-6">
        <h4 className="font-semibold mb-2 text-md text-gray-700">
          Próximos eventos
        </h4>
        {upcomingTasks.length === 0 ? (
          <p className="text-gray-400 text-xs">No hay próximos eventos</p>
        ) : (
          <ul className="text-xs space-y-1">
            {upcomingTasks.map((task) => (
              <li key={task.id} className="flex items-center gap-2">
                <span className="font-mono text-gray-600">
                  {new Date(task.due_date).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "short",
                  })}
                </span>
                <span>-</span>
                <span className="truncate">{task.title}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CalendarWithUpcoming;
