module.exports = function(grunt) {
	'use strict';

	grunt.registerMultiTask('iisexpress', 'Start an IIS Express process.', function() {
		var _ = grunt.util._;
		var options = this.options({
			cmd: 'c:/program files/iis express/iisexpress.exe',
			killOn: '',
			open: false,
			openPath: '/',
			openUrl: null
		});

		if (options.config === undefined &&
			options.path === undefined) {
			options.path = '.';
		}

		// Convert options to command line parameter format
		var args = _.map(_.pairs(_.omit(options, ['cmd', 'killOn', 'open', 'openPath', 'openUrl'])), function(option) {
			if (option[0] == 'path') {
				option[1] = require('path').resolve(option[1]);
			}
			return '-' + option[0] + ':' + option[1];
		});

		var spawnOptions = {
			detached: true
		};

		// Start up IIS Express with the specified arguments
		var spawn = grunt.util.spawn({
			cmd: options.cmd,
			args: args,
			opts: spawnOptions
		}, function(error, result, code) {
			grunt.event.emit('iisexpress.done', error, result, code);
		});

		spawn.stdout.on('data', function (data) {
			grunt.log.write(data);
		});

		spawn.stderr.on('data', function (data) {
			grunt.warn(data);
		});

		grunt.log.ok('Started IIS Express.');

		if (options.open===true) {
			if (!options.port && !options.openUrl) {
				grunt.fail.fatal('Must specify port or openUrl when open==true');
			}
			var url = options.openUrl || 'http://localhost:' + options.port + options.openPath;
			grunt.log.writeln('opening', url);
			require('open')(url);
		}

		if (options.killOn !== '') {
			// Register event listener to use to kill spawned process
			grunt.event.on(options.killOn, function() {
				grunt.log.writeln();
				grunt.log.write('Stopping IIS Express..');
				spawn.kill();
				grunt.log.ok();
			});
		}
	});
};
