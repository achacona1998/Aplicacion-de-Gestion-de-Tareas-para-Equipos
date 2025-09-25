// Mock del módulo api antes de importar teamService
jest.mock('../../../frontend/src/services/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn()
}));

// Mock global fetch
global.fetch = jest.fn();

import {
  fetchUserTeam,
  fetchTeamMembers
} from '../../../frontend/src/services/teamService';

describe('Team Service Integration Tests', () => {
  beforeEach(() => {
    // Limpiar localStorage y mocks antes de cada test
    localStorage.clear();
    jest.clearAllMocks();
    fetch.mockClear();
  });

  describe('fetchUserTeam', () => {
    it('should fetch user team successfully', async () => {
      jest.spyOn(console, 'log').mockImplementation(() => {});
      
      const mockTeam = { id: 1, name: 'Team 1', description: 'First team' };
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ team: mockTeam })
      };
      fetch.mockResolvedValue(mockResponse);

      const result = await fetchUserTeam('user123', 'test-token');

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/v1/users/user123/team',
        {
          method: 'GET',
          headers: { Authorization: 'Bearer test-token' }
        }
      );
      expect(result).toEqual(mockTeam);
      
      console.log.mockRestore();
    });

    it('should return null when no userId provided', async () => {
      jest.spyOn(console, 'warn').mockImplementation(() => {});
      
      const result = await fetchUserTeam(null, 'test-token');
      expect(result).toBeNull();
      expect(fetch).not.toHaveBeenCalled();
      
      console.warn.mockRestore();
    });

    it('should handle fetch errors', async () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      
      const mockResponse = {
        ok: false,
        text: jest.fn().mockResolvedValue('Error message')
      };
      fetch.mockResolvedValue(mockResponse);

      await expect(fetchUserTeam('user123', 'test-token')).rejects.toThrow('Error al obtener el equipo del usuario');
      
      console.error.mockRestore();
    });
  });

  describe('fetchTeamMembers', () => {
    it('should fetch team members successfully', async () => {
      jest.spyOn(console, 'log').mockImplementation(() => {});
      
      const mockMembers = [
        { id: 1, name: 'User 1', email: 'user1@example.com' },
        { id: 2, name: 'User 2', email: 'user2@example.com' }
      ];
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ members: mockMembers })
      };
      fetch.mockResolvedValue(mockResponse);

      const result = await fetchTeamMembers('team123', 'test-token');

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/v1/teams/team123/members',
        {
          method: 'GET',
          headers: { Authorization: 'Bearer test-token' }
        }
      );
      expect(result).toEqual(mockMembers);
      
      console.log.mockRestore();
    });

    it('should return empty array when no teamId provided', async () => {
      jest.spyOn(console, 'warn').mockImplementation(() => {});
      
      const result = await fetchTeamMembers(null, 'test-token');
      expect(result).toEqual([]);
      expect(fetch).not.toHaveBeenCalled();
      
      console.warn.mockRestore();
    });

    it('should handle fetch errors and return empty array', async () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      
      const mockResponse = {
        ok: false,
        text: jest.fn().mockResolvedValue('Error message')
      };
      fetch.mockResolvedValue(mockResponse);

      const result = await fetchTeamMembers('team123', 'test-token');
      expect(result).toEqual([]);
      
      console.error.mockRestore();
    });
  });
});