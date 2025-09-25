module.exports = {
  // Entorno de testing
  testEnvironment: 'jsdom',
  
  // Directorio de tests
  testMatch: [
    '<rootDir>/../test/frontend/**/*.test.{js,jsx}',
    '<rootDir>/../test/frontend/**/*.spec.{js,jsx}'
  ],
  
  // Configuración de cobertura
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/main.jsx',
    '!src/**/*.test.{js,jsx}',
    '!src/**/*.spec.{js,jsx}',
    '!src/**/*.stories.{js,jsx}'
  ],
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/../test/frontend/setup.js'],
  
  // Timeout para tests
  testTimeout: 10000,
  
  // Variables de entorno para testing
  setupFiles: ['<rootDir>/../test/frontend/importMetaMock.js'],
  
  // Ignorar archivos
  testPathIgnorePatterns: [
    '/node_modules/',
    '/coverage/',
    '/dist/'
  ],
  
  // Transformaciones para ES modules y JSX
  transform: {
    '^.+\\.(js|jsx)$': ['babel-jest', {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        ['@babel/preset-react', { runtime: 'automatic' }]
      ]
    }]
  },
  
  // Module name mapping para assets
  moduleNameMapper: {
    // Mock para archivos CSS y de imagen
    '\\.(css|less|scss|sass)$': '<rootDir>/../test/frontend/__mocks__/fileMock.js',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/../test/frontend/__mocks__/fileMock.js',
    
    // Mock para servicios API
    '^@/services/api$': '<rootDir>/../test/frontend/__mocks__/api.js',
    
    // Alias para imports relativos
    '^@/(.*)$': '<rootDir>/src/$1'
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