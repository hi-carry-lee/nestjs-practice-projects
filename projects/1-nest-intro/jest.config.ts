import type { Config } from 'jest';

const config: Config = {
  // Basic Configuration
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testRegex: '.*\\.spec\\.ts$',
  moduleFileExtensions: ['js', 'json', 'ts'],

  // 🚀 PERFORMANCE OPTIMIZATIONS

  // 1. TypeScript Transformer (Optimized ts-jest)
  transform: {
    '^.+\\.(t|j)s$': [
      'ts-jest',
      {
        isolatedModules: true,
        useESM: false,
        tsconfig: {
          declaration: false,
          sourceMap: false,
          removeComments: true,
        },
      },
    ],
  },

  // 2. Caching (Massive performance boost)
  cache: true,
  cacheDirectory: '<rootDir>/.jest-cache',

  // 3. Worker Configuration (Parallel execution)
  maxWorkers: '50%', // Use half of CPU cores
  workerIdleMemoryLimit: '512MB',

  // 4. Coverage Configuration (Optimized)
  collectCoverageFrom: [
    '**/*.(t|j)s',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/coverage/**',
    '!**/test/**',
    '!**/*.spec.ts',
    '!**/*.test.ts',
    '!**/main.ts',
    '!**/index.ts',
  ],
  coverageDirectory: '../coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60,
    },
  },

  // 5. Module Resolution (Faster imports)
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  // 6. Test Isolation and Setup
  setupFilesAfterEnv: [],
  testTimeout: 10000,

  // 7. Verbose and Debugging
  verbose: false,
  silent: false,

  // 8. Mock and Cache Management
  clearMocks: true,
  restoreMocks: true,
  resetMocks: false,

  // 9. File System Optimizations
  watchPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/coverage/',
    '<rootDir>/.jest-cache/',
  ],

  // 10. Performance Monitoring
  detectOpenHandles: false,
  forceExit: true,

  // 11. TypeScript Specific Optimizations
  extensionsToTreatAsEsm: [],

  // 12. Environment Variables for Tests
  setupFiles: [],
};

export default config;
