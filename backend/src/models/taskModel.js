const { pool } = require("../config/database");

class Task {
  // Obtener todas las tareas
  static async getAllTasks() {
    try {
      const [rows] = await pool.query(`
        SELECT t.*, u.username as assignee_name, p.name as project_name 
        FROM tasks t 
        LEFT JOIN users u ON t.assignee_id = u.id 
        LEFT JOIN projects p ON t.project_id = p.id
      `);
      return rows;
    } catch (error) {
      console.error("Error al obtener tareas:", error.message);
      throw error;
    }
  }

  // Obtener tareas por proyecto
  static async getTasksByProject(projectId) {
    try {
      const [rows] = await pool.query(
        `
        SELECT t.*, u.username as assignee_name 
        FROM tasks t 
        LEFT JOIN users u ON t.assignee_id = u.id 
        WHERE t.project_id = ?
      `,
        [projectId]
      );
      return rows;
    } catch (error) {
      console.error(
        `Error al obtener tareas del proyecto ${projectId}:`,
        error.message
      );
      throw error;
    }
  }

  // Obtener tareas asignadas a un usuario
  static async getTasksByUser(userId) {
    try {
      const [rows] = await pool.query(
        `
        SELECT t.*, p.name as project_name 
        FROM tasks t 
        LEFT JOIN projects p ON t.project_id = p.id 
        WHERE t.assignee_id = ?
      `,
        [userId]
      );
      return rows;
    } catch (error) {
      console.error(
        `Error al obtener tareas del usuario ${userId}:`,
        error.message
      );
      throw error;
    }
  }

  // Obtener una tarea por ID
  static async getTaskById(taskId) {
    try {
      const [rows] = await pool.query(
        `
        SELECT t.*, u.username as assignee_name, p.name as project_name 
        FROM tasks t 
        LEFT JOIN users u ON t.assignee_id = u.id 
        LEFT JOIN projects p ON t.project_id = p.id 
        WHERE t.id = ?
      `,
        [taskId]
      );
      return rows[0];
    } catch (error) {
      console.error(`Error al obtener tarea con ID ${taskId}:`, error.message);
      throw error;
    }
  }

  // Crear una nueva tarea
  static async createTask(taskData) {
    try {
      const {
        title,
        description,
        status,
        priority,
        due_date,
        assignee_id,
        project_id,
        created_by,
      } = taskData;
      const [result] = await pool.query(
        "INSERT INTO tasks (title, description, status, priority, due_date, assignee_id, project_id, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          title,
          description,
          status,
          priority,
          due_date,
          assignee_id,
          project_id,
          created_by,
        ]
      );
      return result.insertId;
    } catch (error) {
      console.error("Error al crear tarea:", error.message);
      throw error;
    }
  }

  // Actualizar una tarea
  static async updateTask(taskId, taskData) {
    try {
      const {
        title,
        description,
        status,
        priority,
        due_date,
        assignee_id,
        project_id,
      } = taskData;
      const [result] = await pool.query(
        "UPDATE tasks SET title = ?, description = ?, status = ?, priority = ?, due_date = ?, assignee_id = ?, project_id = ?, updated_at = NOW() WHERE id = ?",
        [
          title,
          description,
          status,
          priority,
          due_date,
          assignee_id,
          project_id,
          taskId,
        ]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error(
        `Error al actualizar tarea con ID ${taskId}:`,
        error.message
      );
      throw error;
    }
  }

  // Actualizar el estado de una tarea
  static async updateTaskStatus(taskId, status) {
    try {
      const [result] = await pool.query(
        "UPDATE tasks SET status = ?, updated_at = NOW() WHERE id = ?",
        [status, taskId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      console.error(
        `Error al actualizar estado de tarea con ID ${taskId}:`,
        error.message
      );
      throw error;
    }
  }

  // Eliminar una tarea
  static async deleteTask(taskId) {
    try {
      const [result] = await pool.query("DELETE FROM tasks WHERE id = ?", [
        taskId,
      ]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Error al eliminar tarea con ID ${taskId}:`, error.message);
      throw error;
    }
  }
}

module.exports = Task;
