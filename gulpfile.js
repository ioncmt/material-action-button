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
var bump = require('gulp-bump');
var deletefile = require('gulp-delete-file');

var DESTINATION = './dist/';
var NAME = 'ion-action-button';
var paths = {
  less: 'src/material-action-button.less',
  compress: 'dist/ion-action-button.js',
  template: 'src/template.html',
  html: 'src/index.html',
  clear: ['dist/material-action-button.css', 'dist/templates.js', 'dist/index.html']
}

paths.watch = ['src/_ion-action-button.less', 'src/material-action-button.js', paths.less, paths.template, paths.html]

var defaultTask = ['clean', 'templateCache', 'less', 'useref', 'compress'];

gulp.task('default', function () {
  runSequence.apply(runSequence, defaultTask);
});
gulp.task('release', function () {
  runSequence.apply(runSequence, defaultTask.concat(['bump', 'mark',
    'clear'
  ]));
});

gulp.task('watch', function () {
  // Callback mode, useful if any plugin in the pipeline depends on the `end`/`flush` event 
  gulp.watch(paths.watch, function () {
    runSequence('default');
  });
});

gulp.task('less', function (cb) {
  pump([
    gulp.src(paths.less),
    sourcemaps.init(),
    less(),
    sourcemaps.write('./maps'),
    gulp.dest(DESTINATION)
  ], cb);
});

gulp.task('compress', function (cb) {
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

gulp.task('templateCache', function () {
  return gulp.src(paths.template)
    .pipe(templateCache({
      module: "$actionButton"
    }))
    .pipe(gulp.dest(DESTINATION));
});

gulp.task('useref', function () {
  return gulp.src(paths.html)
    .pipe(useref())
    .pipe(gulp.dest(DESTINATION));
});

gulp.task('clean', function (cb) {
  pump([gulp.src(DESTINATION, {
      read: false
    }),
    clean(),
  ], cb);
});

gulp.task('clear', function (cb) {
  var regexp = /.*/;
  pump([gulp.src(paths.clear, {
      read: false
    }),
    deletefile({
      reg: regexp,
      deleteMatch: true
    }),
  ], cb);
})

gulp.task('bump', function (cb) {
  //Need to bump twice when marking
  pump([gulp.src('./*.json'),
    bump(),
    gulp.dest('./')
  ], cb);
});

//Call bump before to have a double bump (one to remove -cmt and one to really bump)
gulp.task('mark', ['bump'], function (cb) {
  var version = require("./package.json").version;
  pump([gulp.src('./*.json'),
    bump({
      version: version + "-cmt"
    }),
    gulp.dest('./')
  ], cb);
});