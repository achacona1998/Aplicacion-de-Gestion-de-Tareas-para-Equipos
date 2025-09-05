import React from 'react';

const TeamPage = () => {
  // Datos de ejemplo para el equipo
  const teamMembers = [
    { id: 1, name: 'Ana García', role: 'Project Manager', avatar: 'https://i.pravatar.cc/150?img=1' },
    { id: 2, name: 'Carlos Rodríguez', role: 'Frontend Developer', avatar: 'https://i.pravatar.cc/150?img=8' },
    { id: 3, name: 'Elena Martínez', role: 'Backend Developer', avatar: 'https://i.pravatar.cc/150?img=5' },
    { id: 4, name: 'Miguel López', role: 'UI/UX Designer', avatar: 'https://i.pravatar.cc/150?img=12' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Equipo</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {teamMembers.map(member => (
          <div key={member.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-1 bg-blue-50">
              <img 
                src={member.avatar} 
                alt={member.name} 
                className="w-full h-48 object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg text-gray-800">{member.name}</h3>
              <p className="text-blue-600">{member.role}</p>
              <div className="mt-4 flex justify-center">
                <button className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm hover:bg-blue-200 transition-colors">
                  Ver perfil
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamPage;