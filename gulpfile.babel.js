import gulp from "gulp";
import del from "del";
import ws from "gulp-webserver";
import image from "gulp-image";
import gulp_sass from "gulp-sass";
import node_sass from "node-sass";
import include from "gulp-html-tag-include";
// import gulp, {src, dest} from 'gulp';
// import gulpFont from 'gulp-font';

const sass = gulp_sass(node_sass);

sass.compiler = require("node-sass");

const routes = {
    html: {
        watch: "src/**/*.html",
        src: "src/*.html",
        dest: "build"
    },
    img: {
        src: "src/img/*",
        dest: "build/img"
    },
    // font: {
    //     src: "src/font/*",
    //     dest: "build/font"
    // },
    scss: {
        watch: "src/scss/**/*.scss",
        src: "src/scss/common.scss",
        dest: "build/css"
    },
}

const html_include = () => gulp
    .src(routes.html.src)
    .pipe(include())
    .pipe(gulp.dest(routes.html.dest));

const clean = () => del(["build/"]);

const webserver = () => gulp
    .src("build")
    .pipe(ws({ livereload: true, open: true }))  

const img = () => gulp
    .src(routes.img.src)
    .pipe(image())
    .pipe(gulp.dest(routes.img.dest));

// const font = () => gulp
//     .src(routes.font.src)
//     .pipe(gulpFont({
//         // ext: '.css',
//         fontface: 'src/fontsss',
//         relative: '/fontsss',
//         dest: 'build',
//         // embed: ['woff'],
//         collate: false
//     }))
//     .pipe(gulp.dest(routes.font.dest));

const styles = () => gulp
    .src(routes.scss.src)
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest(routes.scss.dest));

const watch = () => {
    gulp.watch(routes.html.watch, html_include);
    gulp.watch(routes.img.src, img);
    // gulp.watch(routes.font.src, font);
    gulp.watch(routes.scss.watch, styles);
}  

const prepare = gulp.series([clean, img]);

const assets = gulp.series([html_include, styles]);

const postDev = gulp.parallel([webserver, watch]);

export const dev = gulp.series([prepare, assets, postDev]);