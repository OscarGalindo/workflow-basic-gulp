var gulp = require('gulp');
var plugins = require("gulp-load-plugins")({
    pattern: ['gulp-*', 'gulp.*', 'main-bower-files'],
    replaceString: /\bgulp[\-.]/
});
var appName = 'AppName';

var final = {
    appJs: appName + '.min.js',
    appCss: appName + '.min.css',
    vendorScripts: 'plugins.min.js',
    vendorCss: 'plugins.min.css'
};

var paths = {
    vendorScripts: plugins.mainBowerFiles({
        base: 'bower_components',
        filter: /.*\.js$/i
    }),
    vendorCss: plugins.mainBowerFiles({
        base: 'bower_components',
        filter: /.*\.css$/i
    }),
    appScripts: ['js/**/*.js'],
    appCss: ['scss/**/*.scss'],
    build: './build'
};

gulp.task('webserver', function () {
    plugins.connect.server({
        livereload: true,
        root: [__dirname],
        port: 13000
    });
});

gulp.task('html', function () {
    return gulp.src('index.html')
        .pipe(plugins.connect.reload());
});

gulp.task('scripts', function () {
    return gulp.src(paths.appScripts)
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.uglify())
        .pipe(plugins.concat(final.appJs))
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest(paths.build))
        .pipe(plugins.connect.reload());
});

gulp.task('css', function () {
    return gulp.src(paths.appCss)
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.sass())
        .pipe(plugins.concat(final.appCss))
        .pipe(plugins.autoprefixer({
            browsers: ['> 1%', 'last 2 versions'],
            cascade: false
        }))
        .pipe(plugins.minifyCss())
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest(paths.build))
        .pipe(plugins.connect.reload());
});

gulp.task('vendorScripts', function() {
    return gulp.src(paths.vendorScripts)
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.uglify())
        .pipe(plugins.concat(final.vendorScripts))
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest(paths.build))
        .pipe(plugins.connect.reload());
});

gulp.task('vendorCss', function() {
    return gulp.src(paths.vendorCss)
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.concat(final.vendorCss))
        .pipe(plugins.minifyCss())
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest(paths.build))
        .pipe(plugins.connect.reload());
});

gulp.task('watch', ['webserver'], function () {
    gulp.watch('index.html', ['html']);
    gulp.watch(paths.appScripts, ['scripts']);
    gulp.watch(paths.appCss, ['css']);
    gulp.watch(paths.vendorScripts, ['vendorScripts']);
    gulp.watch(paths.vendorCss, ['vendorCss']);
});

gulp.task('default', ['watch', 'vendorScripts', 'vendorCss', 'scripts', 'css']);