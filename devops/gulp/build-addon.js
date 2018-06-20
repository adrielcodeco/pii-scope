const path = require('path')
const gulp = require('gulp')
const run = require('gulp-run-command').default
const runSequence = require('run-sequence')
const clean = require('gulp-clean')

const addonDir = path.resolve(__dirname, '../../test/dummy/addon')

gulp.task('node-gyp-configure', run(`node-gyp -C "${addonDir}" configure`))
gulp.task('node-gyp-build', run(`node-gyp -C "${addonDir}" build`))

gulp.task('addon-copy', function () {
  return gulp
    .src('test/dummy/addon/build/Release/addon.node')
    .pipe(gulp.dest('test/dummy/'))
})

gulp.task('node-gyp-build-clean', function () {
  return gulp.src('test/dummy/addon/build', { read: false }).pipe(clean())
})

gulp.task('build-addon', function (callback) {
  runSequence(
    'node-gyp-configure',
    'node-gyp-build',
    'addon-copy',
    'node-gyp-build-clean',
    callback
  )
})
