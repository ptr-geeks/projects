var browserSync = require('browser-sync').create();

browserSync.init({
    server: '.',
    open: false,
    logFileChanges: false,
    files: '.',
    port: '8080',
    minify: false
});
