const gulp = require('gulp');
const del = require('del');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const terser = require('gulp-terser');
const svgmin = require('gulp-svgmin');
const gulpReplace = require('gulp-replace');
const browserSync = require('browser-sync').create();


const packageFile = require('./package');
const gulppath = require('./gulppath');

const isProductionEnviroment = process.env.NODE_ENV === 'production';

const tasksArr = [];
const taskObjectArr = Object.entries(gulppath.tasks);

for (let key in taskObjectArr) {
  if (taskObjectArr[key][1] !== null) {
    tasksArr.push(taskObjectArr[key][0]);
  }
}

function ltco_styles() {
  const { srcPath, destPath } = gulppath.tasks.ltco_styles;

  return gulp
    .src(srcPath, { sourcemaps: !isProductionEnviroment })
    .pipe(sass({
      outputStyle: isProductionEnviroment ? 'compressed' : 'expanded' // expanded / nested / compact / compressed
    }))
    .pipe(autoprefixer())
    .pipe(gulp.dest(destPath, { sourcemaps: '.' }))
    .pipe(browserSync.stream())
}

gulp.task('ltco_styles', ltco_styles);

function ltco_scripts() {
  const { srcPath, destPath } = gulppath.tasks.ltco_scripts;

  return gulp
    .src(srcPath, { sourcemaps: !isProductionEnviroment })
    .pipe(terser())
    .pipe(gulp.dest(destPath, { sourcemaps: '.' }))
    .pipe(browserSync.stream())
}

gulp.task('ltco_scripts', ltco_scripts);

function ltco_plugins_styles() {
  const { srcPath, destPath } = gulppath.tasks.ltco_plugins_styles;

  return gulp
    .src(srcPath)
    .pipe(gulp.dest(destPath))
    .pipe(browserSync.stream())
}

gulp.task('ltco_plugins_styles', ltco_plugins_styles);

function ltco_plugins_scripts() {
  const { srcPath, destPath } = gulppath.tasks.ltco_plugins_scripts;

  return gulp
    .src(srcPath)
    .pipe(gulp.dest(destPath))
    .pipe(browserSync.stream())
}

gulp.task('ltco_plugins_scripts', ltco_plugins_scripts);

function ltco_images() {
  const { srcPath, destPath } = gulppath.tasks.ltco_images;

  return gulp
    .src(srcPath)
    .pipe(gulp.dest(destPath))
}

gulp.task('ltco_images', ltco_images);

function ltco_svgs() {
  const { srcPath, destPath } = gulppath.tasks.ltco_svgs;

  return gulp
    .src(srcPath)
    .pipe(svgmin())
    .pipe(gulp.dest(destPath))
}

gulp.task('ltco_svgs', ltco_svgs);

function ltco_html() {
  const { srcPath, destPath } = gulppath.tasks.ltco_html;

  return gulp
    .src(srcPath)
    .pipe(gulpReplace(
      '%s',
      isProductionEnviroment ? '/remarkable-cars' : '',
    ))
    .pipe(gulp.dest(destPath))
    .pipe(browserSync.stream())
}

gulp.task('ltco_html', ltco_html);

function ltco_includes() {
  const { srcPath, destPath } = gulppath.tasks.ltco_includes;

  return gulp
    .src(srcPath)
    .pipe(gulp.dest(destPath))
    .pipe(browserSync.stream())
}

gulp.task('ltco_includes', ltco_includes);

function browser() {
  const browserSyncOptions = gulppath.browserSync;

  if (browserSyncOptions) browserSyncOptions.logPrefix = packageFile.name;

  const isWebProxy = process.env.FILES_ENV === 'true';

  const webProxyOptions = {
    logPrefix: packageFile.name,
    open: false,
    server: {
      baseDir: "./public"
    }
  };

  const defaultOptions = {
    logPrefix: packageFile.name,
    open: false,
    server: {
      baseDir: './public',
      serveStaticOptions: {
        extensions: ['html']
      }
    },
    callbacks: {
      ready: function (_err, bs) {
        bs.addMiddleware("*", function (_req, res) {
          res.writeHead(302, {
            location: "404"
          });

          res.end("Redirecting!");
        });
      }
    }
  };

  browserSync.init((isWebProxy ? webProxyOptions : browserSyncOptions) || defaultOptions);
}

gulp.task('browser-sync', browser);

function watch_everyone() {
  const watchPath = gulppath.watch;

  gulp.watch(watchPath.ltco_styles, ltco_styles);

  gulp.watch(watchPath.ltco_scripts, ltco_scripts);

  if (watchPath.ltco_images && process.env.FILES_ENV !== 'true')
    gulp.watch(watchPath.ltco_images, ltco_images);

  if (watchPath.ltco_svgs && process.env.FILES_ENV !== 'true')
    gulp.watch(watchPath.ltco_svgs, ltco_svgs);

  if (watchPath.ltco_all && process.env.FILES_ENV !== 'true')
    gulp.watch(watchPath.ltco_all).on('change', browserSync.reload);

  if (watchPath.ltco_html)
    gulp.watch(watchPath.ltco_html, ltco_html);

  if (watchPath.ltco_includes)
    gulp.watch(watchPath.ltco_includes, ltco_includes);
}

gulp.task('watch_everyone', watch_everyone);

gulp.task('clean', function(){
  return del('public/**', { force: true });
});

gulp.task(
  'server',
  gulp.series(
    gulp.parallel('clean'),
    gulp.parallel(tasksArr),
    gulp.parallel(
      'watch_everyone',
      'browser-sync'
    )
  )
);

gulp.task(
  'dev',
  gulp.series(
    gulp.parallel('clean'),
    gulp.parallel(tasksArr),
    gulp.parallel('watch_everyone')
  )
);

gulp.task(
  'default',
  gulp.series(
    gulp.parallel('clean'),
    gulp.parallel(tasksArr),
  )
);
