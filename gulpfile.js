'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var lint = require('gulp-eslint');
var clean = require('gulp-clean');
var named = require('vinyl-named');
var webpack = require('webpack-stream');

var browserSync = require('browser-sync');


// PATHS

var DIST_PATH = './dist';
var HTML_PATH = './*.html';
var JS_PATH = './scripts/*.js';
var CSS_PATH = './stylesheets/*.scss';
var JS_DIST_PATH = './dist/*.js';
var CSS_DIST_PATH = './dist/*.css';


// CSS Tasks

gulp.task('css:build', ['css:clean'], function () {
    var files = gulp.src(CSS_PATH);
    var sass_handler = sass({
        outputStyle: 'compressed'
    }).on('error', sass.logError)

    return files
        .pipe(sass_handler)
        .pipe(gulp.dest(DIST_PATH));
});

gulp.task('css:clean', function () {
    var files = gulp.src(CSS_DIST_PATH, {read: false});
    var clean_handler = clean();

    return files
        .pipe(clean_handler);
});

gulp.task('css:watch', function () {
    gulp.watch(CSS_PATH, ['css:build']);
});


// BrowserSync Tasks

gulp.task('reload', function() {
  browserSync.reload();
});

gulp.task('serve', function() {
  browserSync({
    server: '.'
  });

  gulp.watch([HTML_PATH, JS_PATH], ['reload']);
  // gulp.watch(CSS_PATH, ['sass']);
});

// JS Tasks

gulp.task('js:build', ['js:lint', 'js:clean'], function () {
    var files = gulp.src(JS_PATH);
    var uglify_handler = uglify();
    var named_handler = named();
    var webpack_handler = webpack({
        module: {
          loaders: [{ loader: 'babel-loader' }],
        },
    });

    return files
        .pipe(named_handler)
        .pipe(webpack_handler)
        .pipe(uglify_handler)
        .pipe(gulp.dest(DIST_PATH))
        .pipe(browserSync.stream());;
});

gulp.task('js:clean', function () {
    var files = gulp.src(JS_DIST_PATH, {read: false});
    var clean_handler = clean();

    return files
        .pipe(clean_handler);
});

gulp.task('js:lint', function () {
    var files = gulp.src(JS_PATH);
    var lint_handler = lint();
    var lint_log_handler = lint.format();

    return files
        .pipe(lint_handler)
        .pipe(lint_log_handler);
});

gulp.task('js:watch', function () {
    gulp.watch(JS_PATH, ['js:build']);
});

gulp.task('default', ['js:watch','css:watch','serve']);