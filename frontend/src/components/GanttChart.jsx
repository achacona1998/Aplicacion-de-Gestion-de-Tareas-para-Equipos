import { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import { getToken } from "../services/auth";

const GanttChart = ({ projectId }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = getToken();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          projectId
            ? `http://localhost:3000/api/v1/tasks/project/${projectId}`
            : "http://localhost:3000/api/v1/tasks",
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) {
          throw new Error("Error al cargar las tareas");
        }

        const data = await response.json();
        setTasks(data.tasks || []);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Error al cargar tareas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [projectId]);

  const formatTasksForGantt = () => {
    const headers = [
      [
        { type: "string", label: "ID Tarea" },
        { type: "string", label: "Nombre Tarea" },
        { type: "string", label: "Recurso" },
        { type: "date", label: "Inicio" },
        { type: "date", label: "Fin" },
        { type: "number", label: "Duración" },
        { type: "number", label: "Porcentaje Completado" },
        { type: "string", label: "Dependencias" },
      ],
    ];

    const rows = tasks.map((task) => [
      task.id.toString(),
      task.title,
      task.assignee_name || "Sin asignar",
      new Date(task.start_date || task.created_at),
      new Date(task.due_date || new Date()),
      null,
      task.status === "completada"
        ? 100
        : task.status === "en_revision"
        ? 75
        : task.status === "en_progreso"
        ? 50
        : 0,
      null,
    ]);

    return [...headers, ...rows];
  };

  const options = {
    height: 400,
    gantt: {
      trackHeight: 30,
      criticalPathEnabled: false,
      innerGridHorizLine: {
        stroke: "#e0e0e0",
        strokeWidth: 1,
      },
      innerGridTrack: { fill: "#f5f5f5" },
      innerGridDarkTrack: { fill: "#f0f0f0" },
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg">
        Error: {error}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No hay tareas disponibles para mostrar en el diagrama de Gantt
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <Chart
        chartType="Gantt"
        width="100%"
        height="400px"
        data={formatTasksForGantt()}
        options={options}
      />
    </div>
  );
};

export default GanttChart;
