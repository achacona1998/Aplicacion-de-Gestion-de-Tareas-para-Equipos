module.exports = {
  // Nombre del proyecto
  displayName: 'Backend Tests',
  
  // Entorno de testing
  testEnvironment: 'node',
  
  // Directorio de tests
  testMatch: [
    '<rootDir>/backend/**/*.test.js',
    '<rootDir>/backend/**/*.spec.js'
  ],
  
  // Configuración de cobertura
  collectCoverage: true,
  coverageDirectory: 'coverage/backend',
  coverageReporters: ['text', 'lcov', 'html'],
  collectCoverageFrom: [
    '../backend/src/**/*.js',
    '!../backend/src/config/**',
    '!../backend/src/app.js',
    '!../backend/index.js'
  ],
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/backend/setup.js'],
  
  // Timeout para tests
  testTimeout: 10000,
  
  // Variables de entorno para testing
  setupFiles: ['<rootDir>/backend/env.setup.js'],
  
  // Ignorar archivos
  testPathIgnorePatterns: [
    '/node_modules/',
    '/coverage/'
  ],
  
  // Transformaciones
  transform: {},
  
  // Verbose output
  verbose: true,
  
  // Detectar archivos abiertos
  detectOpenHandles: true,
  
  // Forzar salida después de los tests
  forceExit: true
};