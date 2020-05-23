var gulp = require('gulp');
var less = require('gulp-less');
var browserSync = require('browser-sync').create();
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var pkg = require('./package.json');
var filesExist = require('files-exist');

function reload(done) {
    browserSync.reload({ stream: true });
    done();
}

gulp.task('copy-files-to-public', function() {
    var publicFiles = [
        'pages/index.html',
        'pages/detailed.html',
        'pages/custom-asset-allocations.html',
        'pages/custom-asset-allocations-detailed.html',
        'pages/sad-face.jpg'
    ];
    return gulp.src(filesExist(publicFiles))
        .pipe(gulp.dest('public'))
});

// Set the banner content
var banner = ['/*!\n',
    ' * Start Bootstrap - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
    ' * Copyright 2013-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
    ' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n',
    ' */\n',
    ''
].join('');

function compileLess() {
    return gulp.src('less/sb-admin-2.less')
        .pipe(less())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(gulp.dest('dist/css'))
        .pipe(minifyCss())
        .pipe(browserSync.stream());
};

function minifyCss() {
    return gulp.src('dist/css/sb-admin-2.css')
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream());
};

function js() {
    return gulp.src(['js/sb-admin-2.js'])
        .pipe(header(banner, { pkg: pkg }))
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.stream());
};

const minifyJs = gulp.series(js, () => {
    return gulp.src('js/sb-admin-2.js')
        .pipe(uglify())
        .pipe(header(banner, { pkg: pkg }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.stream());
});

// Copy vendor libraries from /bower_components into /vendor
const copy = () => {
    gulp.src(['bower_components/bootstrap/dist/**/*', '!**/npm.js', '!**/bootstrap-theme.*', '!**/*.map'])
        .pipe(gulp.dest('vendor/bootstrap'))

    gulp.src(['bower_components/bootstrap-social/*.css', 'bower_components/bootstrap-social/*.less', 'bower_components/bootstrap-social/*.scss'])
        .pipe(gulp.dest('vendor/bootstrap-social'))

    gulp.src(['bower_components/datatables/media/**/*'])
        .pipe(gulp.dest('vendor/datatables'))

    gulp.src(['bower_components/datatables-plugins/integration/bootstrap/3/*'])
        .pipe(gulp.dest('vendor/datatables-plugins'))

    gulp.src(['bower_components/datatables-responsive/css/*', 'bower_components/datatables-responsive/js/*'])
        .pipe(gulp.dest('vendor/datatables-responsive'))

    gulp.src(['bower_components/flot/*.js'])
        .pipe(gulp.dest('vendor/flot'))

    gulp.src(['bower_components/flot.tooltip/js/*.js'])
        .pipe(gulp.dest('vendor/flot-tooltip'))

    gulp.src(['bower_components/font-awesome/**/*', '!bower_components/font-awesome/*.json', '!bower_components/font-awesome/.*'])
        .pipe(gulp.dest('vendor/font-awesome'))

    gulp.src(['bower_components/jquery/dist/jquery.js', 'bower_components/jquery/dist/jquery.min.js'])
        .pipe(gulp.dest('vendor/jquery'))

    gulp.src(['bower_components/metisMenu/dist/*'])
        .pipe(gulp.dest('vendor/metisMenu'))

    gulp.src(['bower_components/morrisjs/*.js', 'bower_components/morrisjs/*.css', '!bower_components/morrisjs/Gruntfile.js'])
        .pipe(gulp.dest('vendor/morrisjs'))

    gulp.src(['bower_components/raphael/raphael.js', 'bower_components/raphael/raphael.min.js'])
        .pipe(gulp.dest('vendor/raphael'))
}

// Run everything
gulp.task('default', gulp.series(minifyCss, minifyJs, copy));

function serve(done) {
    browserSync.init({
        server: {
            index: "/index.html"
        },
    });
    done();
}

function watch() {
    gulp.watch('less/*.less', compileLess);
    gulp.watch('js/*.js', minifyJs);
    // Reloads the browser whenever HTML or JS files change
    gulp.watch('public/*.html').on('change', browserSync.reload);
    gulp.watch('dist/js/*.js').on('change', browserSync.reload);
}

exports.dev = gulp.series(compileLess, minifyJs, serve, watch);
