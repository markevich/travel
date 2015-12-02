var gulp = require('gulp');
var concat = require('gulp-concat');
var babel = require('gulp-babel');
var sass = require('gulp-sass');
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var plumber = require('gulp-plumber');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var cssSrc = 'web/static/css/*.scss';
var cssDest = 'priv/static/css';

var jsSrc = 'web/static/js/**/*.js*';
var jsDest = 'priv/static/js'

function reportChange(event){
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
}

gulp.task('build-sass', function() {
  gulp.src(cssSrc)
      .pipe(sass())
      .pipe(concat('app.css'))
      .pipe(gulp.dest(cssDest));
});

gulp.task('build-js', function() {
  var b = browserify({
    debug: true,
    // defining transforms here will avoid crashing your stream
    transform: [ts]
  });

  return b.bundle()
    .pipe(source(jsSrc))
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    .pipe(sourcemaps.write({ includeContent: false, sourceRoot: '/web/static/js/' }))
    .pipe(gulp.dest(jsDest));
});

gulp.task('build', ['build-js', 'build-sass']);

gulp.task('watch', ['build'], function() {
  gulp.watch([jsSrc, cssSrc], ['build']).on('change', reportChange);
});

gulp.task('default', ['build']);
