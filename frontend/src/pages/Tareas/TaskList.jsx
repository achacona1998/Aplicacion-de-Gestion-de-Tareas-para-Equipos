import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getToken } from "../../services/auth";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    assignee: "",
    project: "",
  });
  const [sortBy, setSortBy] = useState("due_date");
  const [sortOrder, setSortOrder] = useState("asc");
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const token = getToken();

  // Cargar tareas, usuarios y proyectos al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Obtener tareas
        const tasksResponse = await fetch(
          "http://localhost:3000/api/v1/tasks/",
          { method: "GET", headers: { Authorization: `Bearer ${token}` } }
        );

        if (!tasksResponse.ok) throw new Error("Error al cargar tareas");
        const tasksData = await tasksResponse.json();
        setTasks(tasksData.tasks || []);

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

  // Filtrar tareas según los filtros aplicados
  const filteredTasks = tasks.filter((task) => {
    return (
      (filters.status === "" || task.status === filters.status) &&
      (filters.priority === "" || task.priority === filters.priority) &&
      (filters.assignee === "" ||
        task.assignee_id?.toString() === filters.assignee) &&
      (filters.project === "" ||
        task.project_id?.toString() === filters.project)
    );
  });

  // Ordenar tareas según el criterio seleccionado
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    let valueA = a[sortBy];
    let valueB = b[sortBy];

    // Manejar valores nulos o indefinidos
    if (valueA === null || valueA === undefined) valueA = "";
    if (valueB === null || valueB === undefined) valueB = "";

    // Ordenar por fecha
    if (sortBy === "due_date") {
      valueA = valueA ? new Date(valueA).getTime() : 0;
      valueB = valueB ? new Date(valueB).getTime() : 0;
    }

    // Aplicar orden ascendente o descendente
    if (sortOrder === "asc") {
      return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
    } else {
      return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
    }
  });

  // Manejar cambios en los filtros
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Manejar cambios en el ordenamiento
  const handleSortChange = (field) => {
    if (sortBy === field) {
      // Si ya estamos ordenando por este campo, cambiar la dirección
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Si es un nuevo campo, establecerlo como criterio de ordenamiento
      setSortBy(field);
      setSortOrder("asc");
    }
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

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    if (!dateString) return "Sin fecha";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Función para eliminar una tarea
  const handleDeleteTask = async (taskId) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta tarea?")) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/tasks/${taskId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar la tarea");
      }

      // Actualizar la lista de tareas eliminando la tarea borrada
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (err) {
      console.error("Error al eliminar tarea:", err);
      alert("No se pudo eliminar la tarea: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Todas las Tareas</h1>
        <Link
          to="/tasks/new"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors">
          Nueva Tarea
        </Link>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Filtros</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Filtro por Estado */}
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="status">
              Estado
            </label>
            <select
              id="status"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              <option value="">Todos</option>
              <option value="pendiente">Pendiente</option>
              <option value="en_progreso">En Progreso</option>
              <option value="en_revision">En Revisión</option>
              <option value="completada">Completada</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>

          {/* Filtro por Prioridad */}
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="priority">
              Prioridad
            </label>
            <select
              id="priority"
              name="priority"
              value={filters.priority}
              onChange={handleFilterChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              <option value="">Todas</option>
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
              <option value="urgente">Urgente</option>
            </select>
          </div>

          {/* Filtro por Asignado */}
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="assignee">
              Asignado a
            </label>
            <select
              id="assignee"
              name="assignee"
              value={filters.assignee}
              onChange={handleFilterChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              <option value="">Todos</option>
              <option value="null">Sin asignar</option>
              {users.map((user) => (
                <option key={user.id} value={user.id.toString()}>
                  {user.username}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por Proyecto */}
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="project">
              Proyecto
            </label>
            <select
              id="project"
              name="project"
              value={filters.project}
              onChange={handleFilterChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              <option value="">Todos</option>
              <option value="null">Sin proyecto</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id.toString()}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Tareas */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {error && (
          <div className="p-4 bg-red-100 text-red-700">Error: {error}</div>
        )}

        {sortedTasks.length === 0 && !error ? (
          <div className="p-6 text-center text-gray-500">
            No se encontraron tareas con los filtros seleccionados
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSortChange("title")}>
                    Título
                    {sortBy === "title" && (
                      <span className="ml-1">
                        {sortOrder === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSortChange("status")}>
                    Estado
                    {sortBy === "status" && (
                      <span className="ml-1">
                        {sortOrder === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSortChange("priority")}>
                    Prioridad
                    {sortBy === "priority" && (
                      <span className="ml-1">
                        {sortOrder === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSortChange("due_date")}>
                    Fecha Límite
                    {sortBy === "due_date" && (
                      <span className="ml-1">
                        {sortOrder === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Asignado a
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Proyecto
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {task.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          task.status === "completada"
                            ? "bg-green-100 text-green-800"
                            : task.status === "en_progreso"
                            ? "bg-blue-100 text-blue-800"
                            : task.status === "pendiente"
                            ? "bg-yellow-100 text-yellow-800"
                            : task.status === "cancelada"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}>
                        {task.status === "en_progreso"
                          ? "En Progreso"
                          : task.status === "en_revision"
                          ? "En Revisión"
                          : task.status.charAt(0).toUpperCase() +
                            task.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(
                          task.priority
                        )}`}>
                        {task.priority.charAt(0).toUpperCase() +
                          task.priority.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(task.due_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {task.assignee_name || "Sin asignar"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {task.project_name || "Sin proyecto"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/tasks/${task.id}`}
                        className="text-blue-600 hover:text-blue-900 mr-3">
                        Ver
                      </Link>
                      <Link
                        to={`/tasks/${task.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900 mr-3">
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-red-600 hover:text-red-900">
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;
