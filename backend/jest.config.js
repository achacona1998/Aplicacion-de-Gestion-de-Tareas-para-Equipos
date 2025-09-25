module.exports = {
  // Entorno de testing
  testEnvironment: 'node',
  
  // Directorio de tests
  testMatch: [
    '<rootDir>/../test/backend/**/*.test.js',
    '<rootDir>/../test/backend/**/*.spec.js'
  ],
  
  // Configuración de cobertura
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/config/**',
    '!src/app.js',
    '!index.js'
  ],
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/../test/backend/setup.js'],
  
  // Timeout para tests
  testTimeout: 10000,
  
  // Variables de entorno para testing
  setupFiles: ['<rootDir>/../test/backend/env.setup.js'],
  
  // Ignorar archivos
  testPathIgnorePatterns: [
    '/node_modules/',
    '/coverage/'
  ],
  
  // Transformaciones
  transform: {},
  
  // Verbose output
  verbose: true
};