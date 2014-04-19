var gulp = require('gulp');
var es6ModuleTranspiler = require('gulp-es6-module-transpiler');

gulp.task('default', function() {
  return gulp.src("./js/*.js")
    .pipe(es6ModuleTranspiler({
      type: 'cjs'
    }))
    .pipe(gulp.dest("./"));
});
