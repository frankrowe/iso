/* gulpfile.js */

var gulp = require('gulp')
  , browserify = require('browserify')
  , uglify = require('gulp-uglify')
  , reactify = require('reactify')
  , source = require('vinyl-source-stream')
  , rename = require("gulp-rename")
  , less = require('gulp-less')
  , bump = require('gulp-bump')
  , livereload = require('gulp-livereload')
  , path = require('path')
  , fs = require('fs')

var getPackageJson = function () {
  return JSON.parse(fs.readFileSync('./package.json', 'utf8'))
}

gulp.task('bump', function(){
  gulp.src('./package.json')
  .pipe(bump())
  .pipe(gulp.dest('./'));
})

gulp.task('css', function () {
  return gulp.src('./public/css/style.less')
    .pipe(less({
      paths: [ './public/css/' ]
    }))
    .pipe(gulp.dest('./public/css/'))
    .pipe(livereload())
})

gulp.task('js', function() {
  var package = getPackageJson()
  browserify('./src/index.js')
    .transform(reactify)
    .bundle()
    .pipe(source(package.name + '.js'))
    .pipe(gulp.dest('./public/js/min'))
    .pipe(livereload())
})

gulp.task('compress', function() {
  gulp.src('./public/js/min/bundle.js')
    .pipe(uglify())
    .pipe(rename('./bundle.min.js'))
    .pipe(gulp.dest('./public/js/min'))
})

gulp.task('watch', function() {
  livereload.listen()
  gulp.watch('./public/css/*.less', ['bump', 'css'])
  gulp.watch(['./src/**/*.js', './src/**/*.jsx'], ['bump', 'js'])
})

gulp.task('default', ['watch', 'bump', 'css', 'js'])
gulp.task('prod', ['bump', 'css', 'js'])