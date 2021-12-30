const path = require('path')
const { pathsToModuleNameMapper } = require('ts-jest/utils')
const { compilerOptions } = require('./tsconfig.json')

const baseConfig = {
  testRunner: 'jest-circus/runner',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: path.join(__dirname, 'packages/') }),
  setupFilesAfterEnv: [path.join(__dirname, 'jest.setup.ts')],
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      tsconfig: path.join(__dirname, 'tsconfig.json'),
    },
  },
}

module.exports = {
  projects: [
    {
      displayName: 'backend',
      testEnvironment: 'node',
      testMatch: [path.join(__dirname, 'packages/*/__tests__/**/*.spec.ts')],
      ...baseConfig,
    },
    {
      displayName: 'frontend',
      testEnvironment: 'jsdom',
      testMatch: [path.join(__dirname, 'packages/*/__tests__/**/*.spec.tsx')],
      ...baseConfig,
    },
  ],
}
