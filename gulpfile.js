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
  , autoprefixer = require('gulp-autoprefixer')
  , handlebars = require('gulp-compile-handlebars')
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
  return gulp.src('./css/style.less')
    .pipe(less({
      paths: [ './css/' ]
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
     }))
    .pipe(gulp.dest('./css/'))
    .pipe(livereload())
})

gulp.task('js', function() {
  var pkg = getPackageJson()
  browserify('./src/index.js')
    .transform(reactify)
    .bundle()
    .pipe(source(pkg.name + '.js'))
    .pipe(gulp.dest('./js/min'))
    .pipe(livereload())
})

gulp.task('html', function() {
  var pkg = getPackageJson(),
    options = {}
  gulp.src('./views/index.hbs')
    .pipe(handlebars(pkg, options))
    .pipe(rename('index.html'))
    .pipe(gulp.dest('./'))
})

gulp.task('compress', function() {
  gulp.src('./js/min/bundle.js')
    .pipe(uglify())
    .pipe(rename('./bundle.min.js'))
    .pipe(gulp.dest('./js/min'))
})

gulp.task('watch', function() {
  livereload.listen()
  gulp.watch('./css/*.less', ['bump', 'css'])
  gulp.watch(['./src/**/*.js', './src/**/*.jsx'], ['bump', 'js'])
})

gulp.task('default', ['watch', 'bump', 'css', 'js', 'html'])
gulp.task('prod', ['bump', 'css', 'js', 'html'])