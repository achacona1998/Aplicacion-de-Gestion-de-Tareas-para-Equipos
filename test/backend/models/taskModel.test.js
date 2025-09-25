const Task = require('../../../backend/src/models/taskModel');
const { pool } = require('../../../backend/src/config/database');

describe('Task Model', () => {

  describe('getAllTasks', () => {
    it('debería retornar todas las tareas con información de usuario y proyecto', async () => {
      const mockTasks = [
        {
          id: 1,
          title: 'Test Task 1',
          description: 'Description 1',
          status: 'pending',
          priority: 'high',
          due_date: new Date(),
          assignee_id: 1,
          project_id: 1,
          created_by: 1,
          assignee_name: 'John Doe',
          project_name: 'Test Project'
        },
        {
          id: 2,
          title: 'Test Task 2',
          description: 'Description 2',
          status: 'in_progress',
          priority: 'medium',
          due_date: new Date(),
          assignee_id: 2,
          project_id: 1,
          created_by: 1,
          assignee_name: 'Jane Smith',
          project_name: 'Test Project'
        }
      ];

      pool.query.mockResolvedValue([mockTasks]);

      const result = await Task.getAllTasks();

      expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('SELECT'));
      expect(result).toEqual(mockTasks);
      expect(result).toHaveLength(2);
    });

    it('debería manejar errores de base de datos', async () => {
      const mockError = new Error('Database connection failed');
      pool.query.mockRejectedValue(mockError);

      await expect(Task.getAllTasks()).rejects.toThrow('Database connection failed');
    });
  });

  describe('getTasksByProject', () => {
    it('debería retornar tareas filtradas por proyecto', async () => {
      const projectId = 1;
      const mockTasks = [
        {
          id: 1,
          title: 'Project Task 1',
          description: 'Description 1',
          status: 'pending',
          priority: 'high',
          project_id: projectId,
          assignee_name: 'John Doe'
        }
      ];

      pool.query.mockResolvedValue([mockTasks]);

      const result = await Task.getTasksByProject(projectId);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE t.project_id = ?'),
        [projectId]
      );
      expect(result).toEqual(mockTasks);
    });

    it('debería retornar array vacío si no hay tareas para el proyecto', async () => {
      pool.query.mockResolvedValue([[]]);

      const result = await Task.getTasksByProject(999);

      expect(result).toEqual([]);
    });
  });

  describe('getTaskById', () => {
    it('debería retornar una tarea por ID', async () => {
      const taskId = 1;
      const mockTask = {
        id: taskId,
        title: 'Test Task',
        description: 'Test Description',
        status: 'pending',
        priority: 'high',
        due_date: new Date(),
        assignee_id: 1,
        project_id: 1,
        created_by: 1,
        assignee_name: 'John Doe',
        project_name: 'Test Project'
      };

      pool.query.mockResolvedValue([[mockTask]]);

      const result = await Task.getTaskById(taskId);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE t.id = ?'),
        [taskId]
      );
      expect(result).toEqual(mockTask);
    });

    it('debería retornar undefined si la tarea no existe', async () => {
      pool.query.mockResolvedValue([[]]);

      const result = await Task.getTaskById(999);

      expect(result).toBeUndefined();
    });
  });

  describe('createTask', () => {
    it('debería crear una nueva tarea', async () => {
      const taskData = {
        title: 'New Task',
        description: 'New Description',
        status: 'pending',
        priority: 'medium',
        due_date: new Date(),
        assignee_id: 1,
        project_id: 1,
        created_by: 1
      };

      const mockResult = { insertId: 1 };
      pool.query.mockResolvedValue([mockResult]);

      const result = await Task.createTask(taskData);

      expect(pool.query).toHaveBeenCalledWith(
        "INSERT INTO tasks (title, description, status, priority, due_date, assignee_id, project_id, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          taskData.title,
          taskData.description,
          taskData.status,
          taskData.priority,
          taskData.due_date,
          taskData.assignee_id,
          taskData.project_id,
          taskData.created_by
        ]
      );
      expect(result).toBe(mockResult.insertId);
    });

    it('debería manejar errores de creación', async () => {
      const taskData = {
        title: 'New Task',
        description: 'New Description',
        status: 'pending',
        priority: 'medium',
        assignee_id: 1,
        project_id: 1,
        created_by: 1
      };

      const mockError = new Error('Invalid foreign key');
      pool.query.mockRejectedValue(mockError);

      await expect(Task.createTask(taskData)).rejects.toThrow('Invalid foreign key');
    });
  });

  describe('updateTask', () => {
    it('debería actualizar una tarea existente', async () => {
      const taskId = 1;
      const taskData = {
        title: 'Updated Task',
        description: 'Updated Description',
        status: 'completed',
        priority: 'low',
        due_date: new Date(),
        assignee_id: 2,
        project_id: 1
      };

      const mockResult = { affectedRows: 1 };
      pool.query.mockResolvedValue([mockResult]);

      const result = await Task.updateTask(taskId, taskData);

      expect(pool.query).toHaveBeenCalledWith(
        "UPDATE tasks SET title = ?, description = ?, status = ?, priority = ?, due_date = ?, assignee_id = ?, project_id = ?, updated_at = NOW() WHERE id = ?",
        [
          taskData.title,
          taskData.description,
          taskData.status,
          taskData.priority,
          taskData.due_date,
          taskData.assignee_id,
          taskData.project_id,
          taskId
        ]
      );
      expect(result).toBe(true);
    });

    it('debería retornar 0 filas afectadas si la tarea no existe', async () => {
      const taskId = 999;
      const taskData = { title: 'Updated Task' };

      const mockResult = { affectedRows: 0 };
      pool.query.mockResolvedValue([mockResult]);

      const result = await Task.updateTask(taskId, taskData);

      expect(result).toBe(false);
    });
  });

  describe('deleteTask', () => {
    it('debería eliminar una tarea', async () => {
      const taskId = 1;
      const mockResult = { affectedRows: 1 };
      pool.query.mockResolvedValue([mockResult]);

      const result = await Task.deleteTask(taskId);

      expect(pool.query).toHaveBeenCalledWith(
        "DELETE FROM tasks WHERE id = ?",
        [taskId]
      );
      expect(result).toBe(true);
    });

    it('debería manejar errores de eliminación', async () => {
      const taskId = 1;
      const mockError = new Error('Cannot delete task with dependencies');
      pool.query.mockRejectedValue(mockError);

      await expect(Task.deleteTask(taskId)).rejects.toThrow('Cannot delete task with dependencies');
    });
  });

  describe('getTasksByUser', () => {
    it('debería retornar tareas asignadas a un usuario', async () => {
      const userId = 1;
      const mockTasks = [
        {
          id: 1,
          title: 'User Task 1',
          status: 'pending',
          assignee_id: userId
        },
        {
          id: 2,
          title: 'User Task 2',
          status: 'in_progress',
          assignee_id: userId
        }
      ];

      pool.query.mockResolvedValue([mockTasks]);

      const result = await Task.getTasksByUser(userId);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE t.assignee_id = ?'),
        [userId]
      );
      expect(result).toEqual(mockTasks);
    });
  });
});