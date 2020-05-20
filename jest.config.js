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
    '^@models/(.*)$': '<rootDir>/src/models/$1',
    '^@graphql/(.*)$': '<rootDir>/src/graphql/$1',
    '^@store/(.*)$': '<rootDir>/src/store/$1',
    '^@seeds/(.*)$': '<rootDir>/src/store/seeds/$1',
    '^@factories/(.*)$': '<rootDir>/src/store/seeds/factories/$1'
  }
}