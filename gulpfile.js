var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var mamp = require('gulp-mamp');

var options = {};
 
gulp.task('start', function(cb){
  mamp(options, 'start', cb);
});
 
gulp.task('stop', function(cb){
  mamp(options, 'stop', cb);
});
 
gulp.task('mamp', ['start']);

gulp.task('sass', function () {
  gulp.src('sass/**/*')
  // .pipe(sass({includePaths: ['sass'], outputStyle: 'compressed'}))
  .pipe(sass())
  .pipe(gulp.dest('src/css'))
  .pipe(browserSync.stream());
});

gulp.task('watch', function() {
  gulp.watch("sass/**/*.sass", ['sass']);
});

gulp.task('browser-sync', function() {
  browserSync.init(["src/css/*.css", "src/scripts/*.js", '*.html', "views/**/*.html", "components/**/*.html"], {
    proxy: 'http://localhost:8888',
    notify: false
  });
});

gulp.task('default', ['mamp','browser-sync', 'watch']);

