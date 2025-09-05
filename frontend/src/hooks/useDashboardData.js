import { useState, useEffect } from 'react';
import { getToken, getUserIdFromToken } from '../services/auth';
import { fetchTasks, calculateTaskStats } from '../services/taskService';
import { fetchUserTeam, fetchTeamMembers } from '../services/teamService';

/**
 * Hook personalizado para manejar la lógica de datos del dashboard
 * @returns {Object} Estado y funciones para el dashboard
 */
const useDashboardData = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamId, setTeamId] = useState(null);
  const [taskSelected, setTaskSelected] = useState('totales');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    urgent: 0,
  });

  const token = getToken();
  const userId = getUserIdFromToken();

  // Cargar tareas
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);
        const tasksData = await fetchTasks(token);
        setTasks(tasksData);
        
        // Calcular estadísticas
        const calculatedStats = calculateTaskStats(tasksData);
        setStats(calculatedStats);
        
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadTasks();
  }, [token]);

  // Cargar equipo del usuario
  useEffect(() => {
    const loadUserTeam = async () => {
      try {
        const team = await fetchUserTeam(userId, token);
        if (team) {
          setTeamId(team.id);
        }
      } catch (err) {
        console.error('Error al cargar el equipo del usuario:', err);
      }
    };
    
    if (userId && token) {
      loadUserTeam();
    }
  }, [userId, token]);

  // Cargar miembros del equipo
  useEffect(() => {
    const loadTeamMembers = async () => {
      try {
        const members = await fetchTeamMembers(teamId, token);
        setTeamMembers(members);
      } catch (err) {
        console.error('Error al cargar los miembros del equipo:', err);
        setTeamMembers([]);
      }
    };
    
    if (teamId && token) {
      loadTeamMembers();
    }
  }, [teamId, token]);

  return {
    teamMembers,
    tasks,
    loading,
    error,
    stats,
    taskSelected,
    setTaskSelected,
  };
};

export default useDashboardData;