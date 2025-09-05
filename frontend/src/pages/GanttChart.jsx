import React from "react";

const GanttChart = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Diagrama Gantt</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600 mb-4">
          Esta funcionalidad está en desarrollo. Próximamente podrás visualizar
          tus proyectos en un diagrama de Gantt.
        </p>
        <div className="h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
          <span className="text-gray-500">Vista previa del diagrama Gantt</span>
        </div>
      </div>
    </div>
  );
};

export default GanttChart;
