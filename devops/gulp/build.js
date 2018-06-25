const gulp = require('gulp')
const runSequence = require('run-sequence')
const sourcemaps = require('gulp-sourcemaps')
const babel = require('gulp-babel')
const ts = require('gulp-typescript')
const prettierEslint = require('gulp-prettier-eslint')

const tsProject = ts.createProject(require.resolve('../../tsconfig.babel.json'))

gulp.task('ts-build', () =>
  gulp
    .src('src/**/*.ts')
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .pipe(babel())
    .pipe(prettierEslint())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'))
)

gulp.task('build', function (callback) {
  runSequence('clean-dist', 'ts-build', callback)
})
