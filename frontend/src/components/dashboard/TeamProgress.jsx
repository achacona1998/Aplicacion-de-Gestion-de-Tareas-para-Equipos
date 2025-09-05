import React from "react";

// Recibe: teamMembers = [{ id, username, full_name }], tasks = [{ assignee_id, status }]
const TeamProgress = ({ teamMembers, tasks }) => {
  // Calcula tareas completadas y totales por integrante
  const getProgress = (memberId) => {
    // Verificar que tasks sea un array
    if (!Array.isArray(tasks)) {
      console.error("tasks no es un array:", tasks);
      return { completed: 0, total: 0 };
    }
    
    // Filtrar tareas por assignee_id
    const userTasks = tasks.filter((t) => t.assignee_id === memberId);
    console.log(`Tareas para usuario ${memberId}:`, userTasks);
    
    // Contar tareas completadas
    const completed = userTasks.filter((t) => t.status === "completada").length;
    return { completed, total: userTasks.length };
  };

  // Verificar que teamMembers sea un array
  if (!Array.isArray(teamMembers)) {
    console.error("teamMembers no es un array:", teamMembers);
    return (
      <div className="bg-white p-4 rounded shadow flex flex-col">
        <h3 className="text-lg font-bold mb-4">Progreso del equipo</h3>
        <p className="text-gray-500">No hay datos de miembros disponibles.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded shadow flex flex-col">
      <h3 className="text-lg font-bold mb-4">Progreso del equipo</h3>
      <div className="flex flex-col gap-4">
        {teamMembers && teamMembers.length > 0 ? (
          teamMembers.map((member) => {
            if (!member || !member.id) {
              console.error("Miembro inválido:", member);
              return null;
            }
            
            const { completed, total } = getProgress(member.id);
            const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
            // Usar full_name si está disponible, de lo contrario usar username
            const displayName = member.full_name || member.username || "Usuario sin nombre";

            return (
              <div key={member.id} className="mb-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">{displayName}</span>
                  <span className="text-sm text-gray-500">
                    {completed}/{total} tareas
                  </span>
                </div>
                <progress
                  value={completed}
                  max={total || 1}
                  className="w-full h-3 rounded bg-gray-200"
                  style={{ accentColor: "#3b82f6" }} // azul
                  aria-valuenow={completed}
                  aria-valuemax={total}
                  aria-valuemin={0}
                />
                <div className="text-right text-xs text-gray-600 mt-1">
                  {percent}%
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500">No hay miembros en el equipo.</p>
        )}
      </div>
    </div>
  );
};

export default TeamProgress;
