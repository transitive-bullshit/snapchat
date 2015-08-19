var gulp = require('gulp-npm-run')(require('gulp'))
var ghPages = require('gulp-gh-pages')

gulp.task('deploy', [ 'docs' ], function () {
  return gulp.src('./docs/**/*')
    .pipe(ghPages())
})
