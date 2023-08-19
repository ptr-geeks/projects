var gulp = require("gulp");
var browserSync = require("browser-sync").create()
var ts = require("gulp-typescript")
var tsProject = ts.createProject("tsconfig.json");

function serve() {
    browserSync.init({
        server: ".",
        notify: false
    });

    gulp.watch("ts/*.ts", typescript);
    gulp.watch(".").on('change', browserSync.reload);
}

function typescript() {
  return tsProject.src().pipe(tsProject()).js.pipe(gulp.dest("dist")).pipe(browserSync.stream());
}

exports.serve = serve
exports.typescript = typescript
exports.default = serve
