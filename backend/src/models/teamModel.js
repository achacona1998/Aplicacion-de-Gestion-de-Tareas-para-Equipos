const { pool } = require("../config/database");

class Team {
  // Obtener todos los equipos
  static async getAllTeams() {
    try {
      const [rows] = await pool.query(`
        SELECT t.*, u.username as created_by_name, 
        (SELECT COUNT(*) FROM team_members WHERE team_id = t.id) as member_count
        FROM teams t
        LEFT JOIN users u ON t.created_by = u.id
      `);
      return rows;
    } catch (error) {
      console.error("Error al obtener equipos:", error.message);
      throw error;
    }
  }

  // Obtener equipos por usuario (equipos a los que pertenece)
  static async getTeamsByUser(userId) {
    try {
      const [rows] = await pool.query(
        `
        SELECT t.*, u.username as created_by_name, 
        (SELECT COUNT(*) FROM team_members WHERE team_id = t.id) as member_count
        FROM teams t
        JOIN team_members tm ON t.id = tm.team_id
        LEFT JOIN users u ON t.created_by = u.id
        WHERE tm.user_id = ?
      `,
        [userId]
      );
      return rows;
    } catch (error) {
      console.error(
        `Error al obtener equipos del usuario ${userId}:`,
        error.message
      );
      throw error;
    }
  }

  // Obtener un equipo por ID
  static async getTeamById(teamId) {
    try {
      const [rows] = await pool.query(
        `
        SELECT t.*, u.username as created_by_name, 
        (SELECT COUNT(*) FROM team_members WHERE team_id = t.id) as member_count
        FROM teams t
        LEFT JOIN users u ON t.created_by = u.id
        WHERE t.id = ?
      `,
        [teamId]
      );
      return rows[0];
    } catch (error) {
      console.error(`Error al obtener equipo ${teamId}:`, error.message);
      throw error;
    }
  }

  // Obtener miembros de un equipo
  static async getTeamMembers(teamId) {
    try {
      const [rows] = await pool.query(
        `
        SELECT u.id, u.username, u.email, u.full_name, tm.role as team_role, tm.joined_at
        FROM team_members tm
        JOIN users u ON tm.user_id = u.id
        WHERE tm.team_id = ?
      `,
        [teamId]
      );
      return rows;
    } catch (error) {
      console.error(
        `Error al obtener miembros del equipo ${teamId}:`,
        error.message
      );
      throw error;
    }
  }

  // Crear un nuevo equipo
  static async createTeam(teamData) {
    const { name, description, created_by } = teamData;
    try {
      const [result] = await pool.query(
        "INSERT INTO teams (name, description, created_by) VALUES (?, ?, ?)",
        [name, description, created_by]
      );
      return result.insertId;
    } catch (error) {
      console.error("Error al crear equipo:", error.message);
      throw error;
    }
  }

  // Actualizar un equipo
  static async updateTeam(teamId, teamData) {
    const { name, description } = teamData;
    try {
      const [result] = await pool.query(
        "UPDATE teams SET name = ?, description = ? WHERE id = ?",
        [name, description, teamId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Error al actualizar equipo ${teamId}:`, error.message);
      throw error;
    }
  }

  // Eliminar un equipo
  static async deleteTeam(teamId) {
    try {
      const [result] = await pool.query("DELETE FROM teams WHERE id = ?", [
        teamId,
      ]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Error al eliminar equipo ${teamId}:`, error.message);
      throw error;
    }
  }

  // Añadir miembro a un equipo
  static async addTeamMember(teamId, userId, role = "member") {
    try {
      const [result] = await pool.query(
        "INSERT INTO team_members (team_id, user_id, role) VALUES (?, ?, ?)",
        [teamId, userId, role]
      );
      return result.insertId;
    } catch (error) {
      console.error(
        `Error al añadir miembro ${userId} al equipo ${teamId}:`,
        error.message
      );
      throw error;
    }
  }

  // Eliminar miembro de un equipo
  static async removeTeamMember(teamId, userId) {
    try {
      const [result] = await pool.query(
        "DELETE FROM team_members WHERE team_id = ? AND user_id = ?",
        [teamId, userId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error(
        `Error al eliminar miembro ${userId} del equipo ${teamId}:`,
        error.message
      );
      throw error;
    }
  }

  // Verificar si un usuario es miembro de un equipo
  static async isTeamMember(teamId, userId) {
    try {
      const [rows] = await pool.query(
        "SELECT * FROM team_members WHERE team_id = ? AND user_id = ?",
        [teamId, userId]
      );
      return rows.length > 0;
    } catch (error) {
      console.error(
        `Error al verificar si el usuario ${userId} es miembro del equipo ${teamId}:`,
        error.message
      );
      throw error;
    }
  }

  // Verificar si un usuario es líder de un equipo
  static async isTeamLeader(teamId, userId) {
    try {
      const [rows] = await pool.query(
        "SELECT * FROM team_members WHERE team_id = ? AND user_id = ? AND role = 'leader'",
        [teamId, userId]
      );
      return rows.length > 0;
    } catch (error) {
      console.error(
        `Error al verificar si el usuario ${userId} es líder del equipo ${teamId}:`,
        error.message
      );
      throw error;
    }
  }
}

module.exports = Team;
