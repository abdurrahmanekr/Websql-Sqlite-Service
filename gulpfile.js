var gulp = require('gulp');
var minify = require('gulp-minify');

var jsFiles = [
	'./index.js'
];

gulp.task('js', function() {
	// concat
	gulp.src(jsFiles)
		.pipe(minify())
		.pipe(gulp.dest('dist'));

});

gulp.task('default', ['js']);