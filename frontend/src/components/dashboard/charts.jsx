import React from "react";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

// Puedes ajustar los colores a tu gusto
const STATUS_COLORS = {
  completada: "#22c55e", // verde
  pendiente: "#fbbf24", // amarillo
  en_progreso: "#3b82f6", // azul
  cancelada: "#ef4444", // rojo
  en_revision: "#a855f7", // violeta
  otro: "#6b7280", // gris
};

const STATUS_LABELS = {
  completada: "Completadas",
  pendiente: "Pendientes",
  en_progreso: "En Progreso",
  cancelada: "Canceladas",
  en_revision: "En Revisión",
  otro: "Otro",
};

function getStatusKey(status) {
  if (STATUS_LABELS[status]) return status;
  return "otro";
}

const PieChartStatus = ({ tasks }) => {
  // Agrupa las tareas por estado
  const statusCount = {};
  tasks.forEach((task) => {
    const key = getStatusKey(task.status);
    statusCount[key] = (statusCount[key] || 0) + 1;
  });

  // Prepara los datos para el gráfico
  const data = Object.entries(statusCount).map(([key, value]) => ({
    name: STATUS_LABELS[key],
    value,
    color: STATUS_COLORS[key],
  }));

  // Calcula el total de tareas
  const total = tasks.length;

  return (
    <div className="bg-white p-4 rounded shadow flex flex-col  row-span-2 ">
      <h3 className="text-lg font-bold mb-3">Estado del Proyecto</h3>
      <PieChart width={400} height={250}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) =>
            `${name}: ${(percent * 100).toFixed(0)}%`
          }
          outerRadius={80}
          fill="#8884d8"
          dataKey="value">
          {data.map((entry, idx) => (
            <Cell key={`cell-${idx}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          // eslint-disable-next-line no-unused-vars
          formatter={(value, name, props) => [`${value} tareas`, name]}
        />
      </PieChart>
      {/* Leyenda personalizada */}
      <div className="w-full mt-4 flex flex-col gap-1 items-start">
        {data.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2 text-sm justify-between w-full px-5">
            <div className="flex items-center gap-2">
              <span
                className="inline-block w-3 h-3 rounded-full "
                style={{ backgroundColor: entry.color }}></span>
              <span className="font-medium text-lg">{entry.name}</span>
            </div>
            <span className="ml-2 text-gray-500 text-lg font-bold">
              {((entry.value / total) * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PieChartStatus;
