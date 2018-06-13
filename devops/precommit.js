const gulp = require('gulp')
const runSequence = require('run-sequence')

gulp.task('precommit', function (callback) {
  runSequence('npm-build', 'npm-test', 'npm-lintfix', callback)
})
