import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getToken } from "../../services/auth";

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = getToken();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:3000/api/v1/tasks/${id}`,
          { method: "GET", headers: { Authorization: `Bearer ${token}` } }
        );

        if (!response.ok) {
          throw new Error("Error al cargar la tarea");
        }

        const data = await response.json();
        setTask(data.task);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Error al cargar tarea:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  // Función para cambiar el estado de una tarea
  const handleStatusChange = async (newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/tasks/${id}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al actualizar el estado de la tarea");
      }

      // Actualizar el estado de la tarea en el componente
      setTask((prevTask) => ({
        ...prevTask,
        status: newStatus,
      }));
    } catch (err) {
      console.error("Error al actualizar estado:", err);
      alert("No se pudo actualizar el estado: " + err.message);
    }
  };

  // Función para eliminar una tarea
  const handleDeleteTask = async () => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta tarea?")) return;

    try {
      const response = await fetch(`http://localhost:3000/api/v1/tasks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al eliminar la tarea");
      }

      // Redirigir al usuario a la lista de tareas después de eliminar
      navigate("/tasks");
    } catch (err) {
      console.error("Error al eliminar tarea:", err);
      alert("No se pudo eliminar la tarea: " + err.message);
    }
  };

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    if (!dateString) return "Sin fecha";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Función para obtener el color de fondo según la prioridad
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "baja":
        return "bg-blue-100 text-blue-800";
      case "media":
        return "bg-yellow-100 text-yellow-800";
      case "alta":
        return "bg-orange-100 text-orange-800";
      case "urgente":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Función para obtener el color de fondo según el estado
  const getStatusColor = (status) => {
    switch (status) {
      case "completada":
        return "bg-green-100 text-green-800";
      case "en_progreso":
        return "bg-blue-100 text-blue-800";
      case "pendiente":
        return "bg-yellow-100 text-yellow-800";
      case "cancelada":
        return "bg-red-100 text-red-800";
      case "en_revision":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg shadow">
          {error || "No se encontró la tarea solicitada"}
        </div>
        <div className="mt-4">
          <Link
            to="/tasks"
            className="text-blue-600 hover:text-blue-800 font-medium">
            ← Volver a la lista de tareas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center">
        <Link
          to="/tasks"
          className="text-blue-600 hover:text-blue-800 font-medium mr-4">
          ← Volver a la lista
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">{task.title}</h1>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Encabezado con acciones */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span
              className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusColor(
                task.status
              )}`}>
              {task.status === "en_progreso"
                ? "En Progreso"
                : task.status === "en_revision"
                ? "En Revisión"
                : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
            </span>
            <span
              className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getPriorityColor(
                task.priority
              )}`}>
              Prioridad:{" "}
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>
          </div>
          <div className="flex space-x-2">
            <Link
              to={`/tasks/${id}/edit`}
              className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors">
              Editar
            </Link>
            <button
              onClick={handleDeleteTask}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
              Eliminar
            </button>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Columna izquierda: Detalles de la tarea */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <h2 className="text-lg font-medium text-gray-800 mb-2">
                  Descripción
                </h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  {task.description ? (
                    <p className="text-gray-700 whitespace-pre-line">
                      {task.description}
                    </p>
                  ) : (
                    <p className="text-gray-500 italic">Sin descripción</p>
                  )}
                </div>
              </div>

              {/* Cambiar estado */}
              <div>
                <h2 className="text-lg font-medium text-gray-800 mb-2">
                  Cambiar Estado
                </h2>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleStatusChange("pendiente")}
                    className={`px-3 py-1 rounded ${
                      task.status === "pendiente"
                        ? "bg-yellow-500 text-white"
                        : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                    }`}>
                    Pendiente
                  </button>
                  <button
                    onClick={() => handleStatusChange("en_progreso")}
                    className={`px-3 py-1 rounded ${
                      task.status === "en_progreso"
                        ? "bg-blue-500 text-white"
                        : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                    }`}>
                    En Progreso
                  </button>
                  <button
                    onClick={() => handleStatusChange("en_revision")}
                    className={`px-3 py-1 rounded ${
                      task.status === "en_revision"
                        ? "bg-purple-500 text-white"
                        : "bg-purple-100 text-purple-800 hover:bg-purple-200"
                    }`}>
                    En Revisión
                  </button>
                  <button
                    onClick={() => handleStatusChange("completada")}
                    className={`px-3 py-1 rounded ${
                      task.status === "completada"
                        ? "bg-green-500 text-white"
                        : "bg-green-100 text-green-800 hover:bg-green-200"
                    }`}>
                    Completada
                  </button>
                  <button
                    onClick={() => handleStatusChange("cancelada")}
                    className={`px-3 py-1 rounded ${
                      task.status === "cancelada"
                        ? "bg-red-500 text-white"
                        : "bg-red-100 text-red-800 hover:bg-red-200"
                    }`}>
                    Cancelada
                  </button>
                </div>
              </div>
            </div>

            {/* Columna derecha: Información adicional */}
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-medium text-gray-800 mb-4">
                  Información
                </h2>
                <ul className="space-y-3">
                  <li className="flex justify-between">
                    <span className="text-gray-600">Fecha Límite:</span>
                    <span className="font-medium">
                      {formatDate(task.due_date)}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Asignado a:</span>
                    <span className="font-medium">
                      {task.assignee_name || "Sin asignar"}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Proyecto:</span>
                    <span className="font-medium">
                      {task.project_name || "Sin proyecto"}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Creado:</span>
                    <span className="font-medium">
                      {formatDate(task.created_at)}
                    </span>
                  </li>
                  {task.updated_at && (
                    <li className="flex justify-between">
                      <span className="text-gray-600">
                        Última actualización:
                      </span>
                      <span className="font-medium">
                        {formatDate(task.updated_at)}
                      </span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
