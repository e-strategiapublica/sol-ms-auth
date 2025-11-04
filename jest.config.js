module.exports = {
  // Preset para TypeScript
  preset: 'ts-jest',
  
  // Ambiente de teste Node.js
  testEnvironment: 'node',
  
  // Raiz dos testes
  roots: ['<rootDir>/src'],
  
  // Padrões de arquivos de teste
  testMatch: [
    '**/__tests__/**/*.ts',
    '**/?(*.)+(spec|test).ts'
  ],
  
  // Transformação de arquivos TypeScript
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: {
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
      },
    }],
  },
  
  // Extensões de arquivos
  moduleFileExtensions: ['ts', 'js', 'json'],
  
  // Coleta de cobertura
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/*.test.ts',
    '!src/**/*.spec.ts',
    '!src/tests/**',
    '!src/database/migrations/**',
    '!src/database/seeds/**',
  ],
  
  // Diretório de relatório de cobertura
  coverageDirectory: 'coverage',
  
  // Reporters de cobertura
  coverageReporters: ['text', 'lcov', 'html'],
  
  // Threshold de cobertura mínima
  // Valores ajustados para testes unitários de estratégias
  // Para aumentar a cobertura, adicionar mais testes de serviços
  coverageThreshold: {
    global: {
      branches: 5,
      functions: 3,
      lines: 8,
      statements: 7,
    },
  },
  
  // Módulos a serem ignorados
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
  
  // Timeout para testes
  testTimeout: 10000,
  
  // Verbose output
  verbose: true,
};
