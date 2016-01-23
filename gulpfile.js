/**
 * Created by jameymcelveen on 1/22/16.
 */
var gulp = require('gulp'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    dest = require('gulp-dest'),
    uglify = require('gulp-uglify');

gulp.task('build', function() {
    gulp.src([
        'src/data-bind/root.js',
        'src/data-bind/tools.js',
        'src/data-bind/binding.js',
        'src/data-bind/observe-element.js',
        'src/data-bind/observe-object.js',
        'src/data-bind/main.js'])
        .pipe(concat('data-bind.js'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('data-bind.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
    gulp.src([
            'src/custom-ctrls/custom-ctrls_main.js'])
        .pipe(concat('custom-ctrls.js'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('custom-ctrls.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['build'], function() {
});

gulp.task('test', ['build'], function() {
});

gulp.task('start', ['build'], function() {
});

gulp.task('deploy', ['build', 'test'], function() {
});