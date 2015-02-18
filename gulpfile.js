var gulp = require('gulp');
var plugins = require("gulp-load-plugins")({
    pattern: ['gulp-*', 'gulp.*', 'main-bower-files'],
    replaceString: /\bgulp[\-.]/
});

var final = {
    appJs: 'AppName.min.js',
    appCss: 'AppName.min.css',
    vendorJs: 'plugins.min.js',
    vendorCss: 'plugins.min.css'
};

var paths = {
    scripts: plugins.mainBowerFiles({
        base: 'bower_components',
        filter: /.*\.js$/i
    }).concat(['js/**/*.js']),
    scss: plugins.mainBowerFiles({
        base: 'bower_components',
        filter: /.*\.css/i
    }).concat(['scss/**/*.scss']),
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
    return gulp.src(paths.scripts)
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.uglify())
        .pipe(plugins.concat(final.appJs))
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest(paths.build))
        .pipe(plugins.connect.reload());
});

gulp.task('css', function () {
    return gulp.src(paths.scss)
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.concat(final.appCss))
        .pipe(plugins.sass())
        .pipe(plugins.autoprefixer({
            browsers: ['> 1%', 'last 2 versions'],
            cascade: false
        }))
        .pipe(plugins.minifyCss())
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest(paths.build))
        .pipe(plugins.connect.reload());
});

gulp.task('watch', ['webserver'], function () {
    gulp.watch('index.html', ['html']);
    gulp.watch(paths.scripts, ['scripts']);
    gulp.watch(paths.scss, ['css']);
});

gulp.task('default', ['watch', 'scripts', 'css']);