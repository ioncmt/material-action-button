var gulp = require('gulp');
var less = require('gulp-less');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var pump = require('pump');
var clean = require('gulp-clean');
var watch = require('gulp-watch');
var runSequence = require('run-sequence').use(gulp);
var templateCache = require('gulp-angular-templatecache');
var useref = require('gulp-useref');

var DESTINATION = './dist/';
var NAME = 'ion-action-button';
var paths = {
	less: 'src/material-action-button.less',
	compress: 'dist/ion-action-button.js',
	template: 'src/template.html',
	html: 'src/index.html'
}

paths.watch = ['src/_ion-action-button.less', 'src/material-action-button.js', paths.less, paths.template, paths.html]

gulp.task('default', function() {
	runSequence('clean', 'templateCache', 'less', 'useref', 'compress');
});

gulp.task('watch', function() {
	// Callback mode, useful if any plugin in the pipeline depends on the `end`/`flush` event 
	gulp.watch(paths.watch, function() {
		runSequence('default');
	});
});

gulp.task('less', function(cb) {
	pump([
		gulp.src(paths.less),
		sourcemaps.init(),
		less(),
		sourcemaps.write('./maps'),
		gulp.dest(DESTINATION)
	], cb);
});

gulp.task('compress', function(cb) {
	pump([
			gulp.src(paths.compress),
			sourcemaps.init(),
			uglify(),
			sourcemaps.write('./maps'),
			gulp.dest(DESTINATION)
		],
		cb
	);
});

gulp.task('templateCache', function() {
	return gulp.src(paths.template)
		.pipe(templateCache({
			module: "$actionButton"
		}))
		.pipe(gulp.dest(DESTINATION));
});

gulp.task('useref', function() {
	return gulp.src(paths.html)
		.pipe(useref())
		.pipe(gulp.dest(DESTINATION));
});

gulp.task('clean', function(cb) {
	pump([gulp.src(DESTINATION, {
			read: false
		}),
		clean(),
	], cb);
});