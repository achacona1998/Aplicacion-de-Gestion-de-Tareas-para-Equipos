import React from "react";
import StatCard from "./StatCard";
import { getStatCards } from "../../constants/dashboardConstants";

/**
 * Componente para mostrar la sección de estadísticas en el dashboard
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.stats - Estadísticas de tareas
 * @param {String} props.taskSelected - Tipo de tarea seleccionada
 * @param {Function} props.setTaskSelected - Función para cambiar el tipo de tarea seleccionada
 * @returns {React.ReactElement} Componente de sección de estadísticas
 */
const StatsSection = ({ stats, taskSelected, setTaskSelected }) => {
  const statCards = getStatCards(stats, taskSelected);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statCards.map((card) => (
        <StatCard
          key={card.id}
          id={card.id}
          title={card.title}
          stat={card.stat}
          icon={card.icon}
          taskSelected={taskSelected}
          setTaskSelected={setTaskSelected}
        />
      ))}
    </div>
  );
};

export default StatsSection;
