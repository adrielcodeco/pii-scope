const gulp = require('gulp')
const clean = require('gulp-clean')

gulp.task('dist-clean', function () {
  return gulp.src('dist/*', { read: false }).pipe(clean())
})