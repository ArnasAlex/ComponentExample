var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var babelify = require('babelify');
var lint = require('gulp-eslint');
var concat = require('gulp-concat');
var watch = require('gulp-watch');
var runSequence = require('run-sequence');
var cleanCSS = require('gulp-clean-css');

var scriptsCount = 0;
var config = {
    port: 3000,
    paths: {
        client: './client',
        html: './client/*.html',
        js: './client/**/*.js',
        images: './src/images/*',
        css: [
            'node_modules/bootstrap/dist/css/bootstrap.min.css',
            'node_modules/bootstrap/dist/css/bootstrap-theme.min.css',
            'client/css/*'
        ],
        dist: './dist',
        mainJs: './client/app.js'
    },
    dependencies: [
        'react',
        'react-dom',
        'react-router'
    ]
};

gulp.task('js', function () {
    bundleJs();
});

gulp.task('html', function() {
    gulp.src(config.paths.html)
        .pipe(gulp.dest(config.paths.dist));
});

gulp.task('css', function() {
    gulp.src(config.paths.css)
        .pipe(concat('styles.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest(config.paths.dist + '/css'));
});

gulp.task('lint', function() {
    return gulp.src(config.paths.js)
        .pipe(lint())
        .pipe(lint.format());
});

gulp.task('watch', function(cb) {
    var options = {ignoreInitial: false};
    watch(config.paths.html, options, function(){ runSequence('html'); });
    watch(config.paths.css, options, function(){ runSequence('css'); });
    watch(config.paths.js, options, function(){ runSequence(['js', 'lint']); });
});

gulp.task('default', ['watch']);

function bundleJs() {
    scriptsCount++;

    var bundledPath = config.paths.dist + '/js/';
    var appBundler = browserify({
        entries: config.paths.client + '/main.js',
        debug: true
    });

    if (scriptsCount === 1){
        browserify({
            require: config.dependencies,
            debug: true
        })
        .bundle()
        .on('error', gutil.log)
        .pipe(source('vendors.js'))
        .pipe(buffer())
        .pipe(gulp.dest(bundledPath));
    }

    config.dependencies.forEach(function(dep){
        appBundler.external(dep);
    });

    appBundler
        .transform("babelify", {presets: ["es2015", "react"]})
        .bundle()
        .on('error',gutil.log)
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(gulp.dest(bundledPath));
}