const gulp = require('gulp')
const run = require('gulp-run-command').default

gulp.task('npm-test', run('npm t'))
