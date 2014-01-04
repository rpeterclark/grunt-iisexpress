module.exports = function(grunt) {
		'use strict';

	grunt.registerMultiTask('iisexpress', 'Start an IIS Express process.', function() {
		var _ = grunt.util._;
		var options = this.options({
			path: require('path').resolve('.'),
			cmd: 'c:/program files/iis express/iisexpress.exe',
			killOn: ''
		});

		// Convert options to command line parameter format
		var args = _.map(_.pairs(_.omit(options, ['cmd', 'killOn'])), function(option) {
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
			grunt.log.write('IIS Express: ' + data);
		});

		spawn.stderr.on('data', function (data) {
			grunt.warn('IIS Express: ' + data);
		});

		grunt.log.ok('Started IIS Express.');

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
