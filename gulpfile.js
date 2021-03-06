// =============================================================================
// Required
// =============================================================================
//
const child         = require('child_process');
const browserSync   = require('browser-sync').create();

const gulp          = require('gulp');
const gutil         = require('gulp-util');
const sass          = require('gulp-sass');
const postcss       = require('gulp-postcss');
const pug           = require('gulp-pug');
const autoprefixer  = require('autoprefixer');
const rename        = require('gulp-rename');

const siteRoot      = '_site';

// =============================================================================
// Convert SASS to CSS
// =============================================================================

gulp.task('sass', function () {
    return gulp.src('_scss/core.scss')
        .pipe(sass({
            includePaths: ['scss'],
            onError: browserSync.notify,
            // outputStyle: 'compressed'
        }))
        .pipe(postcss([ autoprefixer({ browsers: ['last 12 versions'] }) ]))
        .pipe(gulp.dest('_site/css'))
        .pipe(browserSync.reload({stream:true}))
        .pipe(gulp.dest('assets/css'));
});


// =============================================================================
// Convert Pug to HTML
// =============================================================================
//
gulp.task('pug', function(){
  return gulp.src('_pugfiles/**/*.pug')
  .pipe(pug({pretty: true}))
  .pipe(rename({dirname: ''}))
  .pipe(gulp.dest('_includes'));
});

// =============================================================================
// Jekyll Build
// =============================================================================
//
gulp.task('jekyll', () => {
  const jekyll = child.spawn('jekyll', ['build',
    '--watch',
    '--incremental',
    '--drafts'
  ]);

  const jekyllLogger = (buffer) => {
    buffer.toString()
      .split(/\n/)
      .forEach((message) => gutil.log('Jekyll: ' + message));
  };

  jekyll.stdout.on('data', jekyllLogger);
  jekyll.stderr.on('data', jekyllLogger);
});

// =============================================================================
// BrowserSync
// =============================================================================
//
gulp.task('serve', () => {
  browserSync.init({
    files: [siteRoot + '/**'],
    port: 4000,
    server: {
      baseDir: siteRoot
    }
  });

  gulp.watch('_scss/**/*.scss', ['sass']);
  gulp.watch('_includes/**/*.html', ['jekyll']);
});

// =============================================================================
// Default Task
// =============================================================================
//
gulp.task('default', ['sass', 'jekyll', 'serve']);
