const path = require('path')
const gulp = require('gulp')
const util = require('gulp-util')
const prompt = require('gulp-prompt')

let tasks = ['dist-clean']

tasks.forEach(task => {
  const taskFile = path.resolve('./devops', task + '.js')
  require(taskFile)
})

gulp.task('select-task', function () {
  return gulp.src('./gulpfile.js').pipe(
    prompt.prompt(
      {
        type: 'checkbox',
        name: 'task',
        message: 'Choose your destiny.',
        choices: tasks
      },
      function (result) {
        // Enforce only one selection.
        if (result.task.length > 1) {
          util.colors.red('Please select one task at a time!')
          return
        }
        // Runs the task selected by the user.
        const selectedTask = result.task[0]
        util.log('Running task: ' + util.colors.green(selectedTask))
        gulp.start(selectedTask)
      }
    )
  )
})

gulp.task('default', ['select-task'])
