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

var paths = {
  css: ['./public/css/style.less'],
  index: ['./src/index.js'],
  js: ['./src/**/*.js', './src/**/*.jsx'],
}

gulp.task('bump', function(){
  gulp.src('./package.json')
  .pipe(bump())
  .pipe(gulp.dest('./'));
})

gulp.task('css', function () {
  return gulp.src(paths.css)
    .pipe(less({
      paths: [ './public/css/' ]
    }))
    .pipe(gulp.dest('./public/css/'))
    .pipe(livereload())
})

gulp.task('js', function() {
  var package = getPackageJson()
  browserify(paths.index)
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
  gulp.watch(paths.css, ['bump', 'css'])
  gulp.watch(paths.js, ['bump', 'js'])
})

gulp.task('default', ['watch', 'bump', 'css', 'js'])
gulp.task('prod', ['bump', 'css', 'js'])