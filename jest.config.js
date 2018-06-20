module.exports = {
  verbose: true,
  bail: false,
  collectCoverage: true,
  coverageReporters: ['lcov', 'text'],
  collectCoverageFrom: ['src/**'],
  moduleFileExtensions: ['js', 'json', 'node'],
  testRegex: '/.*\\.unit\\.js$'
}
