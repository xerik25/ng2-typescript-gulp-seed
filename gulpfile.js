'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var watchify = require('watchify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var assign = require('lodash.assign');
var stringify = require('stringify');
var rename = require('gulp-rename');
var browserSync = require('browser-sync');
var tsify = require('tsify');
var imagemin = require('gulp-imagemin');
var typedoc = require('gulp-typedoc');
var historyApiFallback = require('connect-history-api-fallback');
var sassify = require('scssify');
var babelify = require('babelify');

var base = {

    before: './src',
    after: './public'
};

var paths = {

    css: {

        before: base.before + '/**/*.scss',
        after: base.after + '/assets/css'
    },
    fonts: {

        before: base.before + '/globals/fonts/**/*',
        after: base.after + '/assets/fonts'
    },
    images: {

        before: base.before + '/globals/images/**/*',
        after: base.after + '/assets/images'
    },
    js: {

        after: base.after + '/assets/js'
    },
    ts: {

        before: base.before + '/**/*.ts'
    },
    input: base.before + '/index.ts',
    server: base.after
};

var customOpts = {
    entries: [paths.input],
    debug: true
};

var opts = assign({}, watchify.args, customOpts);

var b = watchify(browserify(opts));

b
    .plugin(tsify, {target: 'es6'})
    .transform(babelify, {

        presets: ['es2015', 'stage-1'],
        extensions: ['.ts', '.tsx']
    })
    .transform(sassify, {autoInject: false})
    .transform(stringify, {

        appliesTo: {

            includeExtensions: ['.html', '.css']
        }
    });

b.on('update', bundle); // on any dep update, runs the bundler
b.on('log', gutil.log); // output build logs to terminal

function bundle() {

    return b.bundle()

        // Log all errors, don't fail.
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source('app.js'))
        .pipe(gulp.dest(paths.js.after));
}

gulp.task('js', bundle);

gulp.task('globalCSS', function() {

    return gulp.src('./src/**/app.scss')
        .pipe(sass())
        .pipe(rename(function(path) {

            path.dirname = '';
            path.basename = 'styles';
        }))
        .pipe(gulp.dest(paths.css.after))
});

gulp.task('fonts', function() {

    return gulp.src(paths.fonts.before)
        .pipe(gulp.dest(paths.fonts.after))
});

gulp.task('images', function() {

    return gulp.src(paths.images.before)
        .pipe(imagemin())
        .pipe(gulp.dest(paths.images.after));
});

gulp.task('document', function() {

    return gulp.src(paths.ts.before)
        .pipe(typedoc({

            target: 'ES6',
            mode: 'file',
            theme: 'minimal',
            name: 'Phillips 66 LED Calculator',
            out: './documentation',
            experimentalDecorators: true,
            module: 'commonjs'
        }))
});

gulp.task('server', ['globalCSS', 'js', 'images', 'fonts'], function() {

    browserSync.init({

        server: {

            baseDir: paths.server,
            middleware: [ historyApiFallback() ]
        }
    });

    gulp.watch(paths.fonts.before, ['fonts']);
    gulp.watch(paths.images.before, ['images']);
    gulp.watch(paths.css.before, ['globalCSS']);
    gulp.watch(paths.js.after + '/app.js').on('change', browserSync.reload);
});

gulp.task('default', ['server']);
