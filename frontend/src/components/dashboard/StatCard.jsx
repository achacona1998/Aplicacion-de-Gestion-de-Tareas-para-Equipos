import React from 'react';

/**
 * Componente para mostrar una tarjeta de estadística en el dashboard
 * @param {Object} props - Propiedades del componente
 * @param {String} props.title - Título de la estadística
 * @param {Number} props.stat - Valor de la estadística
 * @param {React.ReactNode} props.icon - Icono a mostrar
 * @param {String} props.id - Identificador de la tarjeta
 * @param {String} props.taskSelected - Tipo de tarea seleccionada
 * @param {Function} props.setTaskSelected - Función para cambiar el tipo de tarea seleccionada
 * @returns {React.ReactElement} Componente de tarjeta de estadística
 */
const StatCard = ({ title, stat, icon, id, taskSelected, setTaskSelected }) => {
  const isSelected = taskSelected === id;

  return (
    <div
      className={`flex flex-col justify-between p-4 rounded-lg shadow-md cursor-pointer transition-all duration-300 ${isSelected ? 'bg-blue-50 border-l-4 border-blue-700' : 'bg-white hover:bg-gray-50'}`}
      onClick={() => setTaskSelected(id)}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-bold mt-1">{stat}</p>
        </div>
        <div className="p-2 rounded-full bg-gray-50">{icon}</div>
      </div>
    </div>
  );
};

export default StatCard;