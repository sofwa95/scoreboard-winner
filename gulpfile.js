'use strict';

var gulp = require('gulp');
var del = require('del');
var concat = require('gulp-concat')
var htmlmin = require('gulp-htmlmin');
let cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync').create();


// Minify CSS files
gulp.task('styles', function () {
  return gulp.src(['./css/*.css', '!./css/*.min.css', '!./css/all-styles.css'])
    // Minify the file
    .pipe(cleanCSS())
    // Output
    .pipe(gulp.dest('./build/static/css'))
    .pipe(browserSync.stream());
});

gulp.task('styles-min', function () {
  return gulp.src(['./css/*.min.css', './css/all-styles.css'])
    .pipe(gulp.dest('./build/static/css'))
    .pipe(browserSync.stream());
});

// Minify and Concate CSS files
gulp.task('styles-concat', function () {
  return gulp.src('./css/concate/*.css')
    // Minify the file
    .pipe(cleanCSS())
    // Concate all file
    .pipe(concat('all-styles.css'))
    // Output
    .pipe(gulp.dest('./css'))
    .pipe(browserSync.stream());
});

// Minify JavaScript files
gulp.task('scripts', function() {
  return gulp.src(['./js/*.js', '!./js/*.min.js', '!./js/all-scripts.js'])
    // Minify the file
    .pipe(uglify())
    // Output
    .pipe(gulp.dest('./build/static/js'))
    .pipe(browserSync.stream());
});

gulp.task('scripts-min', function () {
  return gulp.src(['./js/*.min.js', './js/all-scripts.js'])
    .pipe(gulp.dest('./build/static/js'))
    .pipe(browserSync.stream());
});

// Minify and Concate JavaScript files
gulp.task('scripts-concat', function() {
  return gulp.src('./js/concate/*.js')
    // Minify the file
    .pipe(uglify())
    // Concate all file
    .pipe(concat('all-scripts.js'))
    // Output
    .pipe(gulp.dest('./js'))
    .pipe(browserSync.stream());
});

// Minify HTML files
gulp.task('pages', function() {
  return gulp.src(['./*.html'])
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true,
    }))
    .pipe(gulp.dest('./build'))
    .pipe(browserSync.stream());
});

// Image files
gulp.task('images', function() {
  return gulp.src(['./img/*.*'])
    .pipe(gulp.dest('./build/static/img'))
    .pipe(browserSync.stream());
});

// Vendor files
gulp.task('vendor', function() {
  return gulp.src(['./vendor/**'])
    .pipe(gulp.dest('./build/static/vendor'))
    .pipe(browserSync.stream());
});

// Clean output directory
gulp.task('clean', () => del(['build']));

// Configure the browserSync task
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });
});

// Default task
gulp.task('default', ['browserSync'], function() {
  gulp.watch('./**', browserSync.reload);
});

// Build as production
gulp.task('build', ['clean'], function () {
  runSequence(
    'styles',
    'styles-min',
    'scripts',
    'scripts-min',
    'images',
    'vendor',
    'pages'
  );
});