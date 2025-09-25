// Mock para import.meta en Jest
// Crear un objeto global que simule import.meta
global.importMeta = {
  env: {
    VITE_API_URL: 'http://localhost:3000/api',
    MODE: 'test'
  }
};

// Variables de entorno para tests
process.env.VITE_API_URL = 'http://localhost:3000/api';
process.env.MODE = 'test';