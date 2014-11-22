module.exports = function(grunt) {
	'use strict';

	grunt.registerMultiTask('iisexpress', 'Start an IIS Express process.', function() {
		var _ = grunt.util._;
		var options = this.options({
			cmd: 'c:/program files/iis express/iisexpress.exe',
			killOn: '',
			killOnExit: true,
			open: false,
			openPath: '/',
			openUrl: null,
			verbose: false
		});
		var killed = false;

		// If no entry point defined: run in the current dir
		if (options.config === undefined && options.site === undefined &&
			options.siteid === undefined && options.path === undefined) {
			options.path = '.';
		}

		// Convert options to command line parameter format
		var args = _.map(_.pairs(_.omit(options, ['cmd', 'killOn', 'killOnExit', 'open', 'openPath', 'openUrl', 'verbose'])), function(option) {
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

		if (options.verbose===true) {
			spawn.stdout.on('data', function (data) {
				grunt.log.write(data);
			});
		}

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
			grunt.event.on(options.killOn, kill);
		}

		if (options.killOnExit===true) {
			var readLine = require('readline');

			var rl = readLine.createInterface({
				input: process.stdin,
				output: process.stdout
			});

			rl.on('SIGINT', function () {
				process.emit('SIGINT');
			});

			process.on('exit', kill);
			process.on('SIGINT', killAndExit);
			process.on('SIGHUP', killAndExit);
			process.on('SIGBREAK', killAndExit);
		}

		function kill() {
			if (killed) {
				return;
			}
			if (options.verbose) {
				grunt.log.write('Stopping IIS Express..');
			}
			spawn.kill();
			killed = true;
			if (options.verbose) {
				grunt.log.write(' ');
				grunt.log.ok();
			}
		}

		function killAndExit() {
			kill();
			process.exit();
		}
	});
};
