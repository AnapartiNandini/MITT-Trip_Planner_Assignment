const gulp = require('gulp'); //import gulp file
const browserSync = require('browser-sync');
const imagemin = require('gulp-imagemin');
const cleanCSS = require('gulp-clean-css');
const uglifyJS = require('gulp-uglify');

/**
 * sets the src file
 * creates a pipe to run any necessary gulp functions (const functions)
 * creates a pipe to from the src file to the dest file
 * sets the dest file
 * 
 * Basically, this code copies over the content in the src file/folder to the dest file/folder
 * 
 */

 function minifyJS() {
  return gulp.src('src/*.js')
    .pipe(uglifyJS())
    .pipe(gulp.dest('dist'));
}

 function minifyCSS() {
  return gulp.src('src/*.css')
    .pipe(cleanCSS())
    .pipe(gulp.dest('dist'));
}

function minifyImages() {
  return gulp.src('src/img/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/img'));
}

function copyHTML() {
  return gulp.src('src/*.html')
    .pipe(gulp.dest('dist'));
}

/**
 * Automatically opens broswer with the content when gulp is run in the command line
 */
function sync() {
  browserSync.init({
    server: {
      baseDir: "./dist"
    }
  })
}

/**
 * Watch specified files, directories and run the necessary function to update the files
 */
function watch() {
 gulp.watch("src/*.css", minifyCSS).on('change', browserSync.reload);
 gulp.watch("src/*.js", minifyJS).on('change', browserSync.reload);;
 gulp.watch("src/img/*", minifyImages).on('change', browserSync.reload);;
 gulp.watch("src/*.html", copyHTML).on('change', browserSync.reload);;
}

exports.default = gulp.series(
  gulp.parallel(
    copyHTML, 
    minifyImages, 
    minifyCSS, 
    minifyJS,
  ),
  gulp.parallel(
    sync, 
    watch
  )
); //exports the speciied files out; calls the specified functions