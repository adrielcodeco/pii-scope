const gulp = require('gulp')
const run = require('gulp-run-command').default

gulp.task('npm-typecheck', run('npm run typecheck'))
