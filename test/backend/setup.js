// Setup global para tests
const mysql = require("mysql2/promise");

// Mock de la base de datos para tests
jest.mock("../../backend/src/config/database.js", () => ({
  pool: {
    query: jest.fn(),
    execute: jest.fn(),
    end: jest.fn(),
    getConnection: jest.fn(),
  },
  testConnection: jest.fn(),
}));

// Setup global antes de todos los tests
beforeAll(async () => {
  // Configuración global para tests
  process.env.NODE_ENV = "test";
});

// Cleanup después de todos los tests
afterAll(async () => {
  // Limpiar recursos si es necesario
});

// Setup antes de cada test
beforeEach(() => {
  // Limpiar mocks antes de cada test
  jest.clearAllMocks();

  // Suprimir console logs durante los tests
  // jest.spyOn(console, "log").mockImplementation(() => {});
  // jest.spyOn(console, "error").mockImplementation(() => {});
  // jest.spyOn(console, "warn").mockImplementation(() => {});
});

// Funciones helper globales para tests
global.createMockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

global.createMockRequest = (
  body = {},
  params = {},
  query = {},
  user = null
) => {
  return {
    body,
    params,
    query,
    user,
    headers: {},
  };
};
