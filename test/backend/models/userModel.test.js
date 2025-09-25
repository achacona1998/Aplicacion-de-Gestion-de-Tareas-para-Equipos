const User = require('../../../backend/src/models/userModel');
const { pool } = require('../../../backend/src/config/database');

describe('User Model', () => {

  describe('getAllUsers', () => {
    it('debería retornar todos los usuarios sin contraseñas', async () => {
      const mockUsers = [
        {
          id: 1,
          username: 'testuser1',
          email: 'test1@example.com',
          full_name: 'Test User 1',
          role: 'user',
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 2,
          username: 'testuser2',
          email: 'test2@example.com',
          full_name: 'Test User 2',
          role: 'admin',
          created_at: new Date(),
          updated_at: new Date()
        }
      ];

      pool.query.mockResolvedValue([mockUsers]);

      const result = await User.getAllUsers();

      expect(pool.query).toHaveBeenCalledWith(
        "SELECT id, username, email, full_name, role, created_at, updated_at FROM users"
      );
      expect(result).toEqual(mockUsers);
      expect(result).toHaveLength(2);
    });

    it('debería manejar errores de base de datos', async () => {
      const mockError = new Error('Database connection failed');
      pool.query.mockRejectedValue(mockError);

      await expect(User.getAllUsers()).rejects.toThrow('Database connection failed');
    });
  });

  describe('getUserById', () => {
    it('debería retornar un usuario por ID', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        full_name: 'Test User',
        role: 'user',
        created_at: new Date(),
        updated_at: new Date()
      };

      pool.query.mockResolvedValue([[mockUser]]);

      const result = await User.getUserById(1);

      expect(pool.query).toHaveBeenCalledWith(
        "SELECT id, username, email, full_name, role, created_at, updated_at FROM users WHERE id = ?",
        [1]
      );
      expect(result).toEqual(mockUser);
    });

    it('debería retornar undefined si el usuario no existe', async () => {
      pool.query.mockResolvedValue([[]]);

      const result = await User.getUserById(999);

      expect(result).toBeUndefined();
    });

    it('debería manejar errores de base de datos', async () => {
      const mockError = new Error('Database error');
      pool.query.mockRejectedValue(mockError);

      await expect(User.getUserById(1)).rejects.toThrow('Database error');
    });
  });

  describe('getUserByEmail', () => {
    it('debería retornar un usuario por email', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        full_name: 'Test User',
        role: 'user',
        password: 'hashedpassword',
        created_at: new Date(),
        updated_at: new Date()
      };

      pool.query.mockResolvedValue([[mockUser]]);

      const result = await User.getUserByEmail('test@example.com');

      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM users WHERE email = ?",
        ['test@example.com']
      );
      expect(result).toEqual(mockUser);
    });

    it('debería retornar undefined si el email no existe', async () => {
      pool.query.mockResolvedValue([[]]);

      const result = await User.getUserByEmail('nonexistent@example.com');

      expect(result).toBeUndefined();
    });
  });

  describe('createUser', () => {
    it('debería crear un nuevo usuario', async () => {
      const userData = {
        username: 'newuser',
        email: 'new@example.com',
        full_name: 'New User',
        password: 'hashedpassword',
        role: 'user'
      };

      const mockResult = { insertId: 1 };
      pool.query.mockResolvedValue([mockResult]);

      const result = await User.createUser(userData);

      expect(pool.query).toHaveBeenCalledWith(
        "INSERT INTO users (username, email, password, full_name, role) VALUES (?, ?, ?, ?, ?)",
        [userData.username, userData.email, userData.password, userData.full_name, userData.role]
      );
      expect(result).toBe(mockResult.insertId);
    });

    it('debería manejar errores de creación', async () => {
      const userData = {
        username: 'newuser',
        email: 'new@example.com',
        full_name: 'New User',
        password: 'hashedpassword',
        role: 'user'
      };

      const mockError = new Error('Duplicate entry');
      pool.query.mockRejectedValue(mockError);

      await expect(User.createUser(userData)).rejects.toThrow('Duplicate entry');
    });
  });

  describe('updateUser', () => {
    it('debería actualizar un usuario existente', async () => {
      const userId = 1;
      const userData = {
        username: 'updateduser',
        email: 'updated@example.com',
        full_name: 'Updated User',
        role: 'admin'
      };

      const mockResult = { affectedRows: 1 };
      pool.query.mockResolvedValue([mockResult]);

      const result = await User.updateUser(userId, userData);

      expect(pool.query).toHaveBeenCalledWith(
        "UPDATE users SET username = ?, email = ?, full_name = ?, role = ?, updated_at = NOW() WHERE id = ?",
        [userData.username, userData.email, userData.full_name, userData.role, userId]
      );
      expect(result).toBe(true);
    });
  });

  describe('deleteUser', () => {
    it('debería eliminar un usuario', async () => {
      const userId = 1;
      const mockResult = { affectedRows: 1 };
      pool.query.mockResolvedValue([mockResult]);

      const result = await User.deleteUser(userId);

      expect(pool.query).toHaveBeenCalledWith(
        "DELETE FROM users WHERE id = ?",
        [userId]
      );
      expect(result).toBe(true);
    });

    it('debería manejar errores de eliminación', async () => {
      const userId = 1;
      const mockError = new Error('Foreign key constraint');
      pool.query.mockRejectedValue(mockError);

      await expect(User.deleteUser(userId)).rejects.toThrow('Foreign key constraint');
    });
  });
});