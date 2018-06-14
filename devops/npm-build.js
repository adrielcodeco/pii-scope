const gulp = require('gulp')
const run = require('gulp-run-command').default

gulp.task('npm-build', run('npm run build'))
