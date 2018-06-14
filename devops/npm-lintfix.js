const gulp = require('gulp')
const run = require('gulp-run-command').default

gulp.task('npm-lintfix', run('npm run lintStaged'))
