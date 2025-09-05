const { pool } = require("../config/database");

class Project {
  // Obtener todos los proyectos
  static async getAllProjects() {
    try {
      const [rows] = await pool.query(`
        SELECT p.*, u.username as owner_name, 
        (SELECT COUNT(*) FROM tasks WHERE project_id = p.id) as task_count
        FROM projects p
        LEFT JOIN users u ON p.owner_id = u.id
      `);
      return rows;
    } catch (error) {
      console.error("Error al obtener proyectos:", error.message);
      throw error;
    }
  }

  // Obtener proyectos por equipo
  static async getProjectsByTeam(teamId) {
    try {
      const [rows] = await pool.query(
        `
        SELECT p.*, u.username as owner_name, 
        (SELECT COUNT(*) FROM tasks WHERE project_id = p.id) as task_count
        FROM projects p
        LEFT JOIN users u ON p.owner_id = u.id
        WHERE p.team_id = ?
      `,
        [teamId]
      );
      return rows;
    } catch (error) {
      console.error(
        `Error al obtener proyectos del equipo ${teamId}:`,
        error.message
      );
      throw error;
    }
  }

  // Obtener proyectos por usuario (propietario)
  static async getProjectsByUser(userId) {
    try {
      const [rows] = await pool.query(
        `
        SELECT p.*, 
        (SELECT COUNT(*) FROM tasks WHERE project_id = p.id) as task_count
        FROM projects p
        WHERE p.owner_id = ?
      `,
        [userId]
      );
      return rows;
    } catch (error) {
      console.error(
        `Error al obtener proyectos del usuario ${userId}:`,
        error.message
      );
      throw error;
    }
  }

  // Obtener un proyecto por ID
  static async getProjectById(projectId) {
    try {
      const [rows] = await pool.query(
        `
        SELECT p.*, u.username as owner_name
        FROM projects p
        LEFT JOIN users u ON p.owner_id = u.id
        WHERE p.id = ?
      `,
        [projectId]
      );
      return rows[0];
    } catch (error) {
      console.error(
        `Error al obtener proyecto con ID ${projectId}:`,
        error.message
      );
      throw error;
    }
  }

  // Crear un nuevo proyecto
  static async createProject(projectData) {
    try {
      const {
        name,
        description,
        start_date,
        end_date,
        status,
        owner_id,
        team_id,
      } = projectData;
      const [result] = await pool.query(
        "INSERT INTO projects (name, description, start_date, end_date, status, owner_id, team_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [name, description, start_date, end_date, status, owner_id, team_id]
      );
      return result.insertId;
    } catch (error) {
      console.error("Error al crear proyecto:", error.message);
      throw error;
    }
  }

  // Actualizar un proyecto
  static async updateProject(projectId, projectData) {
    try {
      const {
        name,
        description,
        start_date,
        end_date,
        status,
        owner_id,
        team_id,
      } = projectData;
      const [result] = await pool.query(
        "UPDATE projects SET name = ?, description = ?, start_date = ?, end_date = ?, status = ?, owner_id = ?, team_id = ?, updated_at = NOW() WHERE id = ?",
        [
          name,
          description,
          start_date,
          end_date,
          status,
          owner_id,
          team_id,
          projectId,
        ]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error(
        `Error al actualizar proyecto con ID ${projectId}:`,
        error.message
      );
      throw error;
    }
  }

  // Actualizar el estado de un proyecto
  static async updateProjectStatus(projectId, status) {
    try {
      const [result] = await pool.query(
        "UPDATE projects SET status = ?, updated_at = NOW() WHERE id = ?",
        [status, projectId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error(
        `Error al actualizar estado de proyecto con ID ${projectId}:`,
        error.message
      );
      throw error;
    }
  }

  // Eliminar un proyecto
  static async deleteProject(projectId) {
    try {
      const [result] = await pool.query("DELETE FROM projects WHERE id = ?", [
        projectId,
      ]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error(
        `Error al eliminar proyecto con ID ${projectId}:`,
        error.message
      );
      throw error;
    }
  }
}

module.exports = Project;
