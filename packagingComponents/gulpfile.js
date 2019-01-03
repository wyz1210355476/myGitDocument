var equipment = process.env.equipment;
var folderName = process.env.folderName;
var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
gulp.task('jsmin',function(){
    gulp.src(["D:/dir/"+equipment+"/c_"+folderName+"-01001/*.js","!D:/dir/"+equipment+"/c_"+folderName+"-01001/*min.js"])
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest("D:/dir/"+equipment+"/c_"+folderName+"-01001/"))
});