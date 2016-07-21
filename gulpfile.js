var gulp         = require('gulp'),
    sass         = require('gulp-sass'),
    concat       = require('gulp-concat'),
    uglify       = require('gulp-uglify'),
    autoprefixer = require('gulp-autoprefixer'),
    cssmin       = require('gulp-clean-css'),
    useref       = require('gulp-useref'),
    gulpif       = require('gulp-if'),
    clean        = require('gulp-clean'),
    imagemin     = require('gulp-imagemin'),
    pngquant     = require('imagemin-pngquant'),
    cache        = require('gulp-cache'),
    browserSync  = require('browser-sync'),
    wiredep      = require('wiredep').stream;

//sass-concat
gulp.task('sass', function() {
    return gulp.src('src/sass/**/*.sass')
        .pipe(sass())
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
        .pipe(gulp.dest('src/css'))
        .pipe(browserSync.reload({stream: true}))
});

gulp.task('img', function() {
    return gulp.src('src/img/**/*')
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            une: [pngquant()]
        })))
        .pipe(gulp.dest('dist/img'))
});

//browserSync
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: 'src'
        },
        notify: false
    });
});

//clean
gulp.task('clean', function () {
    return gulp.src('dist', {read: false})
        .pipe(clean());
});

//build
gulp.task('build', ['sass', 'img','clean'], function () {
    return gulp.src('src/*.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', cssmin()))
        .pipe(gulp.dest('dist'));
});

//bower
gulp.task('bower', function () {
    gulp.src('./src/index.html')
        .pipe(wiredep({
            directory : "src/libs"
        }))
        .pipe(gulp.dest('./src'));
});

//watch
gulp.task('watch', ['browser-sync', 'build'], function (){
    gulp.watch('bower.json', ['bower']);
    gulp.watch('src/sass/**/*.sass', ['sass']);
    gulp.watch('src/*.html', browserSync.reload);
    gulp.watch('src/js/**/*.js', browserSync.reload);
});
