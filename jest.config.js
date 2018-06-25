module.exports = {
  verbose: true,
  bail: false,
  collectCoverage: true,
  coverageReporters: ['lcov', 'text'],
  collectCoverageFrom: ['dist/**'],
  moduleFileExtensions: ['js', 'json', 'node'],
  testRegex: '/.*\\.unit\\.[j]s$'
}
