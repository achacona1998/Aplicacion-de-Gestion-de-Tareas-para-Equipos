// Mock del módulo api antes de importar auth
jest.mock('../../../frontend/src/services/api', () => ({
  post: jest.fn(),
  get: jest.fn()
}));

import { login, register, logout, getCurrentUser, isAuthenticated } from '../../../frontend/src/services/auth';

// Mock del módulo api
jest.mock('../../../frontend/src/services/api');
import api from '../../../frontend/src/services/api';

describe('Auth Service Integration Tests', () => {
  beforeEach(() => {
    // Limpiar localStorage y mocks antes de cada test
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should login successfully and store token', async () => {
      const mockResponse = { token: 'test-token', user: { id: 1, email: 'test@example.com' } };
      api.post.mockResolvedValue({ data: mockResponse });

      const credentials = { email: 'test@example.com', password: 'password' };
      const result = await login(credentials);

      expect(api.post).toHaveBeenCalledWith('/users/login', credentials);
      expect(localStorage.getItem('token')).toBe('test-token');
      expect(localStorage.getItem('user')).toBe(JSON.stringify(mockResponse.user));
      expect(result).toEqual(mockResponse);
    });

    it('should handle login error', async () => {
      const mockError = new Error('Invalid credentials');
      api.post.mockRejectedValue(mockError);

      const credentials = { email: 'test@example.com', password: 'wrong-password' };
      await expect(login(credentials)).rejects.toThrow('Invalid credentials');
      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  describe('register', () => {
    it('should register successfully', async () => {
      const mockResponse = { token: 'test-token', user: { id: 1, email: 'test@example.com' } };
      api.post.mockResolvedValue({ data: mockResponse });

      const userData = { email: 'test@example.com', password: 'password', name: 'Test User' };
      const result = await register(userData);

      expect(api.post).toHaveBeenCalledWith('/users/register', userData);
      expect(localStorage.getItem('token')).toBe('test-token');
      expect(localStorage.getItem('user')).toBe(JSON.stringify(mockResponse.user));
      expect(result).toEqual(mockResponse);
    });
  });

  describe('logout', () => {
    it('should clear localStorage on logout', () => {
      localStorage.setItem('token', 'test-token');
      localStorage.setItem('user', JSON.stringify({ id: 1, email: 'test@example.com' }));

      logout();

      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user from localStorage', () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      localStorage.setItem('user', JSON.stringify(mockUser));

      const result = getCurrentUser();

      expect(result).toEqual(mockUser);
    });

    it('should return null if no user in localStorage', () => {
      const result = getCurrentUser();
      expect(result).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true if token exists', () => {
      localStorage.setItem('token', 'test-token');

      const result = isAuthenticated();

      expect(result).toBe(true);
    });

    it('should return false if no token exists', () => {
      const result = isAuthenticated();

      expect(result).toBe(false);
    });
  });
});