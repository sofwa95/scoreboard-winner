'use strict';
let gulp = require('gulp');
let del = require('del');
let concat = require('gulp-concat')
let htmlmin = require('gulp-htmlmin');
let cleanCSS = require('gulp-clean-css');
let uglify = require('gulp-uglify');
let replace = require('gulp-html-replace');
let prompt = require('gulp-prompt');
let rename = require('gulp-rename')
let runSequence = require('run-sequence');
let browserSync = require('browser-sync').create();

var html_name = 'index'
var js_name = 'scripts'
var css_name = 'styles'
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
    .pipe(concat(`${css_name}.css`))
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
    .pipe(concat(`${js_name}.js`))
    // Output
    .pipe(gulp.dest('./js'))
    .pipe(browserSync.stream());
});

// Minify HTML files
gulp.task('pages', function() {
  return gulp.src(['./*.html', '!./index.html'])
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true,
    }))
    .pipe(gulp.dest('./build'))
    .pipe(browserSync.stream());
});

// Minify index.html
gulp.task('index', function() {
  return gulp.src(['./index.html'])
    .pipe(replace({
      'header':'%include views/shared/header.html',
      'navbar':'%include views/shared/navbar.html',
      'footer':'%include views/shared/footer.html',
      'css': `css/${css_name}.css`,
      'js': `js/${js_name}.js`
    }))
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true,
      preserveLineBreaks: true,
      ignoreCustomFragments: [ /<%[\s\S]*?%>/, /<\?[\s\S]*?\?>/, /<\/head>/ ]
    }))
    .pipe(rename(`${html_name}.html`))
    .pipe(gulp.dest('./build'))
    .pipe(browserSync.stream());
});

// Minify index.html
gulp.task('index-no-bundler', function() {
  return gulp.src(['./index.html'])
    .pipe(replace({
      'header':'%include views/shared/header.html',
      'navbar':'%include views/shared/navbar.html',
      'footer':'%include views/shared/footer.html',
      'css': "",
      'js': ""
    }))
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true,
      preserveLineBreaks: true,
      ignoreCustomFragments: [ /<%[\s\S]*?%>/, /<\?[\s\S]*?\?>/, /<\/head>/ ]
    }))
    .pipe(rename(`${html_name}.html`))
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

// Fonts files
gulp.task('font', function() {
  return gulp.src(['./fonts/**'])
    .pipe(gulp.dest('./build/static/fonts'))
    .pipe(browserSync.stream());
});

// SVG files
gulp.task('svg', function() {
  return gulp.src(['./svg/**'])
    .pipe(gulp.dest('./build/static/svg'))
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

// Input name
gulp.task('input-name', function () {
  return gulp.src('')
  .pipe(prompt.prompt([
    {
      type: 'input',
      name: 'html_name',
      message: 'Enter the new name for index.html:'
    },
    {
      type: 'input',
      name: 'js_name',
      message: 'Enter the new name for bundled js [Press ENTER to skip]:'
    },
    {
      type: 'input',
      name: 'css_name',
      message: 'Enter the new name for bundled css [Press ENTER to skip]:'
    }], function(val){
        let html_name_temp = ''
        let css_name_temp = ''
        let js_name_temp = ''
        try {
          html_name_temp = val.html_name.match(/\S+/g)
          css_name_temp = val.css_name.match(/\S+/g)
          js_name_temp = val.js_name.match(/\S+/g)
          if (html_name_temp) {
            html_name = html_name_temp.join('')
          } else {
            console.log("INVALID HTML NAME!")
            process.exit()
          }
          if (css_name_temp) {
            css_name = css_name_temp.join('')
          }
          if (js_name_temp) {
            js_name = js_name_temp.join('')
          }
        } catch (error) {
          console.log("INPUT NAME ERROR!")
          console.log(error)
          process.exit()
        }
    })
  )
});

// Build as production
gulp.task('build', function () {
  console.log(".....STARTING OPERATION.....")  
  runSequence(
    'clean',
    'input-name',
    'styles',
    'styles-min',
    'styles-concat',
    'scripts',
    'scripts-min',
    'scripts-concat',
    'images',
    'vendor',
    'font',
    'svg',
    'pages',
    'index'
  );
});

// Build as production
gulp.task('build-no-bundler', function () {
  console.log(".....STARTING OPERATION.....")
  runSequence(
    'clean',
    'input-name',
    'styles',
    'styles-min',
    'styles-concat',
    'scripts',
    'scripts-min',
    'scripts-concat',
    'images',
    'vendor',
    'font',
    'svg',
    'pages',
    'index'
  );
});

// Default task
gulp.task('default', ['browserSync'], function() {
  gulp.watch('./**', browserSync.reload);
});