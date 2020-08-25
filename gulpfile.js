let gulp = require('gulp'),
  sass = require('gulp-sass'),
  cleancss = require("gulp-clean-css"),
  rename = require('gulp-rename'),
  browserSync = require('browser-sync'),
  autoprefixer = require('gulp-autoprefixer'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  cssmin = require('gulp-cssmin'),
  ttf2woff2 = require('gulp-ttf2woff2'),
  ttf2woff = require('gulp-ttf2woff'),
  include = require('gulp-file-include'),
  size = require('gulp-filesize'),
  imagemin = require('gulp-imagemin'),
  recompress = require('imagemin-jpeg-recompress'),
  pngquant = require('imagemin-pngquant'),
  del = require('del'),
  webp = require('gulp-webp'),
  babel = require("gulp-babel"),
  sourcemaps = require("gulp-sourcemaps"),
  gulpStylelint = require("gulp-stylelint");

gulp.task('sass', function () {
  return gulp
    .src('src/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 8 versions']
    }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(
      cleancss({
        compatibility: "ie8",
        level: {
          1: {
            specialComments: 0,
            removeEmpty: true,
            removeWhitespace: true,
          },
          2: {
            mergeMedia: true,
            removeEmpty: true,
            removeDuplicateFontRules: true,
            removeDuplicateMediaBlocks: true,
            removeDuplicateRules: true,
            removeUnusedAtRules: true,
          },
        },
      }),
    )
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({ stream: true }))
});

gulp.task('style', function () {
  return gulp.src([
    'node_modules/normalize.css/normalize.css',
    'node_modules/slick-carousel/slick/slick.css',
    'node_modules/aos/dist/aos.css',
    'node_modules/@fancyapps/fancybox/dist/jquery.fancybox.css'

  ])
    .pipe(concat('libs.min.css'))
    .pipe(cssmin())
    .pipe(gulp.dest('app/css'))
    .pipe(size())
});

gulp.task("minjs", function () {
  return gulp
    .src("src/js/*.js")
    .pipe(size())
    .pipe(babel())
    .pipe(uglify())
    .pipe(
      rename({
        suffix: ".min",
      }),
    )
    .pipe(gulp.dest("app/js"))
    .pipe(size());
});

gulp.task('script', function () {
  return gulp.src([
    'node_modules/slick-carousel/slick/slick.js',
    'node_modules/aos/dist/aos.js',
    'node_modules/@fancyapps/fancybox/dist/jquery.fancybox.js'
  ])
    .pipe(size())
    .pipe(babel())
    .pipe(concat('libs.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('app/js'))
    .pipe(size())
});

gulp.task('html', function () {
  return gulp
    .src(['src/*.html', '!src/components/**/*.html'])
    .pipe(
      include({
        prefix: "@@",
        basepath: "@file",
      }),
    )
    .pipe(gulp.dest("app/"))
    .pipe(browserSync.reload({ stream: true }))
});

gulp.task("deletefonts", function () {
	
	return del.sync("app/fonts/**/*.*");
});

gulp.task("deleteimg", function () {

	return del.sync("app/images/**/*.*");
});

gulp.task('js', function () {
  return gulp.src('app/js/*.js')
    .pipe(browserSync.reload({ stream: true }))
});

gulp.task('lintCss', function lintCssTask() {
  return gulp
    .src('src/**/*.scss')
    .pipe(gulpStylelint(
      {
      reporters: [
        {formatter: 'string', 
        console: true}
      ]
    }));
});

gulp.task('browser-sync', function () {
  browserSync.init({
    server: {
      baseDir: "app/"
    }
  });
});

gulp.task('ttf2woff', function () {
  return gulp.src(['src/fonts/*.ttf'])
    .pipe(ttf2woff())
    .pipe(gulp.dest('app/fonts/'));
});

gulp.task('ttf2woff2', function () {
  return gulp.src(['src/fonts/*.ttf'])
    .pipe(ttf2woff2())
    .pipe(gulp.dest('app/fonts/'));
});

gulp.task('images', function () {
  return gulp
    .src("src/images/**/*.+(png|jpg|jpeg|gif|svg|ico|webp)")
    .pipe(size())
    .pipe(
      imagemin(
        [
          recompress({
            loops: 4, //количество прогонок изображения
            min: 50, //минимальное качество в процентах
            max: 95, //максимальное качество в процентах
            quality: 'high',
            use: [pngquant()],
          }),
          imagemin.gifsicle(), //тут и ниже всякие плагины для обработки разных типов изображений
          imagemin.optipng(),
          imagemin.svgo(),
        ],
      ),
    )
    .pipe(gulp.dest("app/images/"))
    .pipe(
      browserSync.reload({
        stream: true,
      }),
    )
    .pipe(size());
});

gulp.task("webp", function () {
  return gulp
    .src("src/images/**/*.+(png|jpg|jpeg|gif|svg|ico|webp)")
    .pipe(size())
    .pipe(webp({
      quality: 95,
      method: 6,
    }))
    .pipe(gulp.dest("app/images"))
    .pipe(
      browserSync.reload({
        stream: true,
      }),
    )
    .pipe(size())
});

gulp.task('watch', function () {
  gulp.watch('src/scss/**/*.scss', gulp.parallel('sass', 'lintCss'))
  gulp.watch(['src/*.html', 'src/components/**/*.html'], gulp.parallel('html'))
  gulp.watch('src/js/*js', gulp.parallel('js', 'minjs'))
  gulp.watch('src/fonts/**/*.ttf', gulp.parallel('ttf2woff2', 'ttf2woff'))
  gulp.watch('src/images/**/*.+(png|jpg|jpeg|gif|svg|ico|webp)', gulp.parallel('images'));
})

gulp.task('default', gulp.parallel('sass', 'style', 'minjs', 'script', 'watch', 'browser-sync', 'ttf2woff2', 'ttf2woff', 'images'))

