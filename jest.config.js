module.exports = {
  verbose: true,
  bail: false,
  collectCoverage: true,
  coverageReporters: ['lcov', 'text'],
  collectCoverageFrom: ['src/**'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  globals: {
    'ts-jest': {
      tsConfigFile: 'tsconfig.json',
      ignoreCoverageForDecorators: true,
      ignoreCoverageForAllDecorators: true
    }
  },
  testRegex: '/.*\\.unit\\.[tj]s$'
}
