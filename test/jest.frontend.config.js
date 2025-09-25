module.exports = {
  // Nombre del proyecto
  displayName: 'Frontend Tests',
  
  // Entorno de testing
  testEnvironment: 'jsdom',
  
  // Directorio de tests
  testMatch: [
    '<rootDir>/frontend/**/*.test.{js,jsx}',
    '<rootDir>/frontend/**/*.spec.{js,jsx}'
  ],
  
  // Configuración de cobertura
  collectCoverage: true,
  coverageDirectory: 'coverage/frontend',
  coverageReporters: ['text', 'lcov', 'html'],
  collectCoverageFrom: [
    '../frontend/src/**/*.{js,jsx}',
    '!../frontend/src/main.jsx',
    '!../frontend/src/**/*.stories.{js,jsx}',
    '!../frontend/src/**/*.test.{js,jsx}',
    '!../frontend/src/**/*.spec.{js,jsx}'
  ],
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/frontend/setup.js'],
  
  // Timeout para tests
  testTimeout: 10000,
  
  // Variables de entorno para testing
  setupFiles: ['<rootDir>/frontend/importMetaMock.js'],
  
  // Ignorar archivos
  testPathIgnorePatterns: [
    '/node_modules/',
    '/coverage/',
    '/dist/'
  ],
  
  // Mapeo de módulos
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/frontend/__mocks__/fileMock.js',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/frontend/__mocks__/fileMock.js',
    '^@/(.*)$': '<rootDir>/../frontend/src/$1',
    '^@/services/api$': '<rootDir>/frontend/__mocks__/api.js'
  },
  
  // Transformaciones para ES modules y JSX
  transform: {
    '^.+\\.(js|jsx)$': ['babel-jest', {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        ['@babel/preset-react', { runtime: 'automatic' }]
      ]
    }]
  },
  
  // Extensiones de archivos
  moduleFileExtensions: ['js', 'jsx', 'json'],
  
  // Verbose output
  verbose: true,
  
  // Configuración para ES modules
  extensionsToTreatAsEsm: ['.jsx'],
  
  // Transformar node_modules que usan ES modules
  transformIgnorePatterns: [
    'node_modules/(?!(.*\\.mjs$))'
  ],
  
  // Detectar archivos abiertos
  detectOpenHandles: true,
  
  // Configuración adicional para React
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons']
  }
};