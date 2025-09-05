import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from "chart.js";
import { Pie, Line } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
import Layout from "../components/Layout";

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [taskFilter, setTaskFilter] = useState("todas");
  const [sortBy, setSortBy] = useState("fecha");

  // Cargar datos del proyecto y sus tareas
  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        // Obtener datos del proyecto
        const projectResponse = await fetch(
          `http://localhost:3000/api/v1/projects/${id}`
        );

        if (!projectResponse.ok) {
          throw new Error("No se pudo cargar el proyecto");
        }

        const projectData = await projectResponse.json();
        setProject(projectData.project);

        // Obtener tareas del proyecto
        const tasksResponse = await fetch(
          `http://localhost:3000/api/v1/tasks/project/${id}`
        );

        if (!tasksResponse.ok) {
          throw new Error("No se pudieron cargar las tareas del proyecto");
        }

        const tasksData = await tasksResponse.json();
        setTasks(tasksData.tasks || []);

        setError(null);
      } catch (err) {
        console.error("Error al cargar datos del proyecto:", err);
        setError("Error al cargar los datos del proyecto. Inténtalo de nuevo.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [id]);

  // Función para eliminar el proyecto
  const handleDeleteProject = async () => {
    if (!confirm("¿Estás seguro de que deseas eliminar este proyecto?")) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/projects/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("No se pudo eliminar el proyecto");
      }

      // Redireccionar a la lista de proyectos
      navigate("/projects");
    } catch (err) {
      console.error("Error al eliminar proyecto:", err);
      alert("Error al eliminar el proyecto. Inténtalo de nuevo.");
    }
  };

  // Función para mostrar el estado del proyecto con color
  const getStatusBadge = (status) => {
    const statusMap = {
      pendiente: "bg-yellow-100 text-yellow-800",
      en_progreso: "bg-blue-100 text-blue-800",
      completado: "bg-green-100 text-green-800",
      cancelado: "bg-red-100 text-red-800",
    };

    const statusText = {
      pendiente: "Pendiente",
      en_progreso: "En Progreso",
      completado: "Completado",
      cancelado: "Cancelado",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          statusMap[status] || "bg-gray-100 text-gray-800"
        }`}>
        {statusText[status] || status}
      </span>
    );
  };

  // Función para mostrar la prioridad de una tarea con color
  const getPriorityBadge = (priority) => {
    const priorityMap = {
      baja: "bg-green-100 text-green-800",
      media: "bg-yellow-100 text-yellow-800",
      alta: "bg-orange-100 text-orange-800",
      urgente: "bg-red-100 text-red-800",
    };

    const priorityText = {
      baja: "Baja",
      media: "Media",
      alta: "Alta",
      urgente: "Urgente",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          priorityMap[priority] || "bg-gray-100 text-gray-800"
        }`}>
        {priorityText[priority] || priority}
      </span>
    );
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return "No definida";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-600">Cargando proyecto...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
          <div className="mt-4">
            <Link to="/projects" className="text-blue-600 hover:text-blue-800">
              ← Volver a la lista de proyectos
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            Proyecto no encontrado
          </div>
          <div className="mt-4">
            <Link to="/projects" className="text-blue-600 hover:text-blue-800">
              ← Volver a la lista de proyectos
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  // Calcular estadísticas del proyecto
  const projectStats = {
    total: tasks.length,
    completadas: tasks.filter((t) => t.status === "completada").length,
    enProgreso: tasks.filter((t) => t.status === "en_progreso").length,
    pendientes: tasks.filter((t) => t.status === "pendiente").length,
    porcentajeCompletado:
      tasks.length > 0
        ? Math.round(
            (tasks.filter((t) => t.status === "completada").length /
              tasks.length) *
              100
          )
        : 0,
  };

  // Datos para el gráfico circular
  const pieData = {
    labels: ["Completadas", "En Progreso", "Pendientes"],
    datasets: [
      {
        data: [
          projectStats.completadas,
          projectStats.enProgreso,
          projectStats.pendientes,
        ],
        backgroundColor: ["#10B981", "#3B82F6", "#F59E0B"],
        borderWidth: 1,
      },
    ],
  };

  // Datos para la línea de tiempo
  const timelineData = {
    labels: tasks.map((t) => formatDate(t.created_at)).slice(-7),
    datasets: [
      {
        label: "Tareas Completadas",
        data: tasks.map((t) => (t.status === "completada" ? 1 : 0)).slice(-7),
        borderColor: "#10B981",
        tension: 0.1,
      },
    ],
  };

  // Filtrar y ordenar tareas
  const filteredTasks = tasks
    .filter((task) => {
      if (taskFilter === "todas") return true;
      return task.status === taskFilter;
    })
    .sort((a, b) => {
      if (sortBy === "fecha")
        return new Date(b.created_at) - new Date(a.created_at);
      if (sortBy === "prioridad") {
        const prioridadOrder = { urgente: 3, alta: 2, media: 1, baja: 0 };
        return prioridadOrder[b.priority] - prioridadOrder[a.priority];
      }
      return 0;
    });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Encabezado del proyecto */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
            <div className="flex items-center gap-4">
              {getStatusBadge(project.status)}
              <span className="text-gray-600">
                Fecha de inicio: {formatDate(project.start_date)}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              to={`/projects/${id}/edit`}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors">
              Editar
            </Link>
            <button
              onClick={handleDeleteProject}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors">
              Eliminar
            </button>
          </div>
        </div>

        {/* Estadísticas y Gráficos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">
              Progreso del Proyecto
            </h2>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-4xl font-bold text-blue-600">
                  {projectStats.porcentajeCompletado}%
                </p>
                <p className="text-gray-600">Completado</p>
              </div>
              <div className="w-48 h-48">
                <Pie data={pieData} options={{ maintainAspectRatio: true }} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-green-50 p-3 rounded">
                <p className="text-2xl font-bold text-green-600">
                  {projectStats.completadas}
                </p>
                <p className="text-sm text-gray-600">Completadas</p>
              </div>
              <div className="bg-blue-50 p-3 rounded">
                <p className="text-2xl font-bold text-blue-600">
                  {projectStats.enProgreso}
                </p>
                <p className="text-sm text-gray-600">En Progreso</p>
              </div>
              <div className="bg-yellow-50 p-3 rounded">
                <p className="text-2xl font-bold text-yellow-600">
                  {projectStats.pendientes}
                </p>
                <p className="text-sm text-gray-600">Pendientes</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Línea de Tiempo</h2>
            <Line
              data={timelineData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: "top" },
                  title: {
                    display: true,
                    text: "Progreso en los últimos 7 días",
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Lista de Tareas */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Tareas del Proyecto</h2>
              <Link
                to={`/tasks/new?project=${id}`}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors">
                Nueva Tarea
              </Link>
            </div>
            <div className="flex gap-4 mb-4">
              <select
                className="border rounded px-3 py-2"
                value={taskFilter}
                onChange={(e) => setTaskFilter(e.target.value)}>
                <option value="todas">Todas las tareas</option>
                <option value="pendiente">Pendientes</option>
                <option value="en_progreso">En Progreso</option>
                <option value="completada">Completadas</option>
              </select>
              <select
                className="border rounded px-3 py-2"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}>
                <option value="fecha">Ordenar por fecha</option>
                <option value="prioridad">Ordenar por prioridad</option>
              </select>
            </div>
          </div>
          <div className="p-6">
            {filteredTasks.length > 0 ? (
              <div className="space-y-4">
                {filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg mb-2">
                          {task.title}
                        </h3>
                        <p className="text-gray-600 mb-2">{task.description}</p>
                        <div className="flex gap-2">
                          {getStatusBadge(task.status)}
                          {getPriorityBadge(task.priority)}
                          <span className="text-sm text-gray-500">
                            Fecha límite: {formatDate(task.due_date)}
                          </span>
                        </div>
                      </div>
                      <Link
                        to={`/tasks/${task.id}`}
                        className="text-blue-600 hover:text-blue-800">
                        Ver detalles
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center">
                No hay tareas que coincidan con los filtros seleccionados.
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default ProjectDetail;
