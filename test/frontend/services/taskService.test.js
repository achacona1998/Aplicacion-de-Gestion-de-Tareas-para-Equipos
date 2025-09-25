// Mock del módulo api antes de importar taskService
jest.mock('../../../frontend/src/services/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn()
}));

// Mock global fetch
global.fetch = jest.fn();

import {
  fetchTasks,
  calculateTaskStats,
  filterTasks
} from '../../../frontend/src/services/taskService';

describe('Task Service Integration Tests', () => {
  beforeEach(() => {
    // Limpiar localStorage y mocks antes de cada test
    localStorage.clear();
    jest.clearAllMocks();
    fetch.mockClear();
  });

  describe('fetchTasks', () => {
    it('should fetch tasks successfully', async () => {
      const mockTasks = [
        { id: 1, title: 'Task 1', status: 'pendiente' },
        { id: 2, title: 'Task 2', status: 'completada' }
      ];
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ tasks: mockTasks })
      };
      fetch.mockResolvedValue(mockResponse);

      // Suprimir console.log para este test
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      const result = await fetchTasks('test-token');

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/v1/tasks',
        {
          method: 'GET',
          headers: { Authorization: 'Bearer test-token' }
        }
      );
      expect(result).toEqual(mockTasks);
      
      consoleSpy.mockRestore();
    });

    it('should handle fetch errors', async () => {
      const mockResponse = {
        ok: false,
        text: jest.fn().mockResolvedValue('Error message')
      };
      fetch.mockResolvedValue(mockResponse);

      // Suprimir console.error para este test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      await expect(fetchTasks('test-token')).rejects.toThrow('Error al cargar las tareas');
      
      consoleSpy.mockRestore();
    });

    it('should return empty array when no tasks in response', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({})
      };
      fetch.mockResolvedValue(mockResponse);

      // Suprimir console.log para este test
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      const result = await fetchTasks('test-token');
      expect(result).toEqual([]);
      
      consoleSpy.mockRestore();
    });
  });

  describe('calculateTaskStats', () => {
    it('should calculate task statistics correctly', () => {
      const tasks = [
        { id: 1, status: 'pendiente', priority: 'alta' },
        { id: 2, status: 'completada', priority: 'media' },
        { id: 3, status: 'pendiente', priority: 'urgente' },
        { id: 4, status: 'completada', priority: 'baja' }
      ];

      const result = calculateTaskStats(tasks);

      expect(result.total).toBe(4);
      expect(result.pending).toBe(2);
      expect(result.completed).toBe(2);
    });

    it('should handle empty array', () => {
      const result = calculateTaskStats([]);

      expect(result.total).toBe(0);
      expect(result.pending).toBe(0);
      expect(result.completed).toBe(0);
    });

    it('should handle invalid input', () => {
      // Suprimir console.error para este test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const result = calculateTaskStats(null);

      expect(result.total).toBe(0);
      expect(result.pending).toBe(0);
      expect(result.completed).toBe(0);
      
      consoleSpy.mockRestore();
    });
  });

  describe('filterTasks', () => {
    const tasks = [
      { id: 1, status: 'pendiente', priority: 'alta' },
      { id: 2, status: 'completada', priority: 'media' },
      { id: 3, status: 'pendiente', priority: 'urgente' },
      { id: 4, status: 'completada', priority: 'baja' }
    ];

    it('should filter pending tasks', () => {
      const result = filterTasks(tasks, 'pendientes');
      expect(result).toHaveLength(2);
      expect(result.every(task => task.status === 'pendiente')).toBe(true);
    });

    it('should filter completed tasks', () => {
      const result = filterTasks(tasks, 'completadas');
      expect(result).toHaveLength(2);
      expect(result.every(task => task.status === 'completada')).toBe(true);
    });

    it('should return all tasks for unknown filter', () => {
      const result = filterTasks(tasks, 'unknown');
      expect(result).toEqual(tasks);
    });

    it('should handle empty array', () => {
      const result = filterTasks([], 'pending');
      expect(result).toEqual([]);
    });
  });
});