import { Link } from "react-router-dom";
import CalendarWithUpcoming from "../components/dashboard/calendar";
import PieChartStatus from "../components/dashboard/charts";
import TeamProgress from "../components/dashboard/TeamProgress";
import StatsSection from "../components/dashboard/StatsSection";
import RecentTasks from "../components/dashboard/RecentTasks";
import useDashboardData from "../hooks/useDashboardData";

/**
 * Componente principal del Dashboard
 * @returns {React.ReactElement} Componente Dashboard
 */
const Dashboard = () => {
  // Usar el hook personalizado para manejar los datos del dashboard
  const {
    teamMembers,
    tasks,
    loading,
    error,
    stats,
    taskSelected,
    setTaskSelected,
  } = useDashboardData();

  // Mostrar indicador de carga mientras se obtienen los datos
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Mostrar mensaje de error si ocurrió algún problema
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Encabezado del Dashboard */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Panel de Control</h1>
        <Link
          to="/tasks/new"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors">
          Nueva Tarea
        </Link>
      </div>

      {/* Sección de estadísticas */}
      <StatsSection 
        stats={stats} 
        taskSelected={taskSelected} 
        setTaskSelected={setTaskSelected} 
      />

      {/* Contenido principal del Dashboard */}
      <div className="grid lg:grid-cols-3 gap-8 md:grid-cols-2 grid-cols-1">
        {/* Columna izquierda y central - Tareas recientes y progreso del equipo */}
        <div className="lg:col-span-2 space-y-8">
          <RecentTasks tasks={tasks} taskSelected={taskSelected} />
          <TeamProgress teamMembers={teamMembers} tasks={tasks} />
        </div>

        {/* Columna derecha - Calendario y gráfico de estado */}
        <div className="space-y-8">
          <CalendarWithUpcoming tasks={tasks} />
          <PieChartStatus tasks={tasks} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
