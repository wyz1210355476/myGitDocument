var buildRouter = process.env.buildRouter;
var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
gulp.task('jsmin',function(){
    gulp.src([buildRouter+"-01001/*.js","!"+buildRouter+"-01001/*min.js"])
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest(buildRouter+"-01001/"))
});