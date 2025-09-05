import { useState, useEffect } from "react";
import { getToken } from "../services/auth";

const TaskForm = ({ task, onSubmit, onCancel }) => {
  // Estado inicial del formulario
  const initialFormState = {
    title: "",
    description: "",
    status: "pendiente",
    priority: "media",
    due_date: "",
    assignee_id: "",
    project_id: "",
  };
  const token = getToken();
  // Estado para los datos del formulario
  const [formData, setFormData] = useState(initialFormState);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar datos de la tarea si se está editando
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        status: task.status || "pendiente",
        priority: task.priority || "media",
        due_date: task.due_date ? task.due_date.split("T")[0] : "",
        assignee_id: task.assignee_id || "",
        project_id: task.project_id || "",
      });
    } else {
      setFormData(initialFormState);
    }
  }, [task]);

  // Cargar usuarios y proyectos al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Obtener usuarios
        const usersResponse = await fetch(
          "http://localhost:3000/api/v1/users",
          { method: "GET", headers: { Authorization: `Bearer ${token}` } }
        );
        if (!usersResponse.ok) throw new Error("Error al cargar usuarios");
        const usersData = await usersResponse.json();
        setUsers(usersData.users || []);

        // Obtener proyectos (cuando se implemente la API de proyectos)
        // const projectsResponse = await fetch('http://localhost:3000/api/v1/projects');
        // if (!projectsResponse.ok) throw new Error('Error al cargar proyectos');
        // const projectsData = await projectsResponse.json();
        // setProjects(projectsData.projects || []);

        // Datos de proyectos de ejemplo mientras no hay API
        setProjects([
          { id: 1, name: "Proyecto 1" },
          { id: 2, name: "Proyecto 2" },
          { id: 3, name: "Proyecto 3" },
        ]);

        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Error al cargar datos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        Cargando formulario...
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        {task ? "Editar Tarea" : "Crear Nueva Tarea"}
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          Error: {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Título */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="title">
            Título *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        {/* Descripción */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="description">
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
          />
        </div>

        {/* Estado */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="status">
            Estado
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            <option value="pendiente">Pendiente</option>
            <option value="en_progreso">En Progreso</option>
            <option value="en_revision">En Revisión</option>
            <option value="completada">Completada</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>

        {/* Prioridad */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="priority">
            Prioridad
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
            <option value="urgente">Urgente</option>
          </select>
        </div>

        {/* Fecha Límite */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="due_date">
            Fecha Límite
          </label>
          <input
            type="date"
            id="due_date"
            name="due_date"
            value={formData.due_date}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        {/* Asignado a */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="assignee_id">
            Asignado a
          </label>
          <select
            id="assignee_id"
            name="assignee_id"
            value={formData.assignee_id}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            <option value="">Sin asignar</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </select>
        </div>

        {/* Proyecto */}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="project_id">
            Proyecto
          </label>
          <select
            id="project_id"
            name="project_id"
            value={formData.project_id}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            <option value="">Sin proyecto</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end mt-6 space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors">
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
            {task ? "Actualizar" : "Crear"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
