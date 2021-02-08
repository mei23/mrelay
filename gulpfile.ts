import * as gulp from 'gulp';
import * as ts from 'gulp-typescript';
const sourcemaps = require('gulp-sourcemaps');
import * as rimraf from 'rimraf';

gulp.task('build:ts', () => {
	const tsProject = ts.createProject('./tsconfig.json');

	return tsProject
		.src()
		.pipe(sourcemaps.init())
		.pipe(tsProject())
		.on('error', () => {})
		.pipe(sourcemaps.write('.', { includeContent: false, sourceRoot: '../built' }))
		.pipe(gulp.dest('./built/'));
});

//gulp.task('build:copy', () =>
//	gulp.src([
//		'./src/const.json',
//		'./src/server/web/views/**/*',
//		'./src/**/assets/**/*',
//		'!./src/client/app/**/assets/**/*'
//	]).pipe(gulp.dest('./built/'))
//);

gulp.task('clean', gulp.parallel(
	cb => rimraf('./built', cb),
	cb => rimraf('./node_modules/.cache', cb)
));

gulp.task('cleanall', gulp.parallel('clean', cb =>
	rimraf('./node_modules', cb)
));

gulp.task('build', gulp.parallel(
	'build:ts'
));

gulp.task('default', gulp.task('build'));
