var gulp = require("gulp");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");

gulp.task("default", function () {
   
});

gulp.task('html', function(){
  return gulp.src('src/*.html')
    .pipe(gulp.dest('dist'))
});

gulp.task('ts', function(){
   return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("dist"));
});

gulp.task('default', [ 'html', 'ts' ]);

