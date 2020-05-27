module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.ts?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/$1',
    '^@repositories/(.*)$': '<rootDir>/src/repositories/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@models/(.*)$': '<rootDir>/src/models/$1',
    '^@graphql/(.*)$': '<rootDir>/src/graphql/$1',
    '^@validators/(.*)$': '<rootDir>/src/graphql/validators/$1',
    '^@store/(.*)$': '<rootDir>/src/store/$1',
    '^@seeds/(.*)$': '<rootDir>/src/store/seeds/$1',
    '^@factories/(.*)$': '<rootDir>/src/store/seeds/factories/$1',
    '^@tests/(.*)$': '<rootDir>/src/tests/$1'
  }
}