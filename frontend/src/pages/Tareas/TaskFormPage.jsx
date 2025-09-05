import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TaskForm from "../../components/TaskForm";
import { getToken } from "../../services/auth";

const TaskFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [task, setTask] = useState(null);
  const token = getToken();

  // Cargar la tarea si estamos en modo edición
  useState(() => {
    if (id) {
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
    }
  }, [id]);

  // Manejar el envío del formulario
  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      const url = id
        ? `http://localhost:3000/api/v1/tasks/${id}`
        : "http://localhost:3000/api/v1/tasks";
      const method = id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Error al ${id ? "actualizar" : "crear"} la tarea`);
      }

      // Redirigir a la página de detalles o lista de tareas
      const data = await response.json();
      const taskId = id || data.taskId;
      navigate(`/tasks/${taskId}`);
    } catch (err) {
      setError(err.message);
      console.error("Error al guardar tarea:", err);
    } finally {
      setLoading(false);
    }
  };

  // Manejar la cancelación del formulario
  const handleCancel = () => {
    navigate(id ? `/tasks/${id}` : "/tasks");
  };

  if (loading && id) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error && id) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg shadow">
          {error}
        </div>
        <button
          onClick={() => navigate("/tasks")}
          className="mt-4 text-blue-600 hover:text-blue-800">
          Volver a la lista de tareas
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {id ? "Editar Tarea" : "Crear Nueva Tarea"}
      </h1>
      <TaskForm task={task} onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
};

export default TaskFormPage;
