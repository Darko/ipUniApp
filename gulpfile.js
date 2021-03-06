var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var browserify = require('browserify');
var mamp = require('gulp-mamp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var babelify = require('babelify');
var autoprefixer = require('gulp-autoprefixer');
 
gulp.task('start', function(cb){
  mamp({}, 'start', cb);
});
 
gulp.task('stop', function(cb){
  mamp({}, 'stop', cb);
});
 
gulp.task('mamp', ['start']);

gulp.task('php', function() {
  return browserSync.reload();
});

gulp.task('sass', function () {
  gulp.src('sass/**/*.sass')
  .pipe(sourcemaps.init())
  // .pipe(sass({includePaths: ['sass'], outputStyle: 'compressed'}))
  .pipe(sass())
  .pipe(autoprefixer())
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('dist/css'))
  .pipe(browserSync.reload({stream: true}))
});

gulp.task('build', function () {
  var b = browserify({
    entries: 'client/src/scripts/app.js',
    debug: true
  })
  .transform(babelify.configure({
    presets: ["es2015"]
  }));
  
  return b.bundle()
  .pipe(source('app.js'))
  .pipe(buffer())
  .pipe(sourcemaps.init({loadMaps: true}))
  .on('error', gutil.log)
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest('./dist/js'));
});

gulp.task('build-reload', ['build'], function() {
  return browserSync.reload();
});

gulp.task('watch', function() {
  gulp.watch(['./sass/**/*.sass', './client/**/*.sass'], ['sass']);
  gulp.watch('./api/**/*.php', ['php']);
  gulp.watch('./client/**/*.js', ['build-reload']);
});

gulp.task('browser-sync', function() {
  browserSync.init(['client/src/scripts/*.js', 'client/**/*.html'], {
    proxy: 'http://localhost:8888',
    notify: false
  });
});

gulp.task('default', ['mamp', 'browser-sync', 'watch', 'build-reload', 'sass']);