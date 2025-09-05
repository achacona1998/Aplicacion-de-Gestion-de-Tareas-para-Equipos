import api from './api';

/**
 * Servicio para manejar las operaciones relacionadas con equipos
 */

/**
 * Obtiene el equipo de un usuario
 * @param {String} userId - ID del usuario
 * @param {String} token - Token de autenticación
 * @returns {Object} Información del equipo
 */
export const fetchUserTeam = async (userId, token) => {
  try {
    if (!userId) {
      console.warn("fetchUserTeam: No se proporcionó userId");
      return null;
    }
    
    console.log("Obteniendo equipo para el usuario:", userId);
    const response = await fetch(`http://localhost:3000/api/v1/users/${userId}/team`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error al obtener el equipo del usuario:", errorText);
      throw new Error("Error al obtener el equipo del usuario");
    }

    const data = await response.json();
    console.log("Datos del equipo del usuario:", data);
    
    if (data && data.team && data.team.id) {
      return data.team;
    } else {
      console.warn("No se encontró un equipo para el usuario");
      return null;
    }
  } catch (err) {
    console.error("Error completo al obtener el equipo del usuario:", err);
    throw err;
  }
};

/**
 * Obtiene los miembros de un equipo
 * @param {String} teamId - ID del equipo
 * @param {String} token - Token de autenticación
 * @returns {Array} Lista de miembros del equipo
 */
export const fetchTeamMembers = async (teamId, token) => {
  try {
    if (!teamId) {
      console.log("No hay ID de equipo disponible para obtener miembros");
      return [];
    }
    
    console.log("Obteniendo miembros para el equipo:", teamId);
    const response = await fetch(`http://localhost:3000/api/v1/teams/${teamId}/members`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error al obtener los miembros del equipo:", errorText);
      throw new Error("Error al obtener los miembros del equipo");
    }

    const data = await response.json();
    console.log("Miembros del equipo obtenidos:", data);
    
    if (data && Array.isArray(data.members)) {
      return data.members;
    } else {
      console.warn("No se recibieron datos de miembros en formato esperado:", data);
      return [];
    }
  } catch (err) {
    console.error("Error completo al obtener los miembros del equipo:", err);
    return [];
  }
};