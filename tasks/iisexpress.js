module.exports = function(grunt) {
	'use strict';

	grunt.registerMultiTask('iisexpress', 'Start an IIS Express process.', function() {
		var _ = grunt.util._;
		var options = this.options({
			cmd: 'c:/program files/iis express/iisexpress.exe',
			keepalive: false,
			killOn: '',
			killOnExit: true,
			open: false,
			openPath: '/',
			openUrl: null,
			verbose: false,
			waitUntilStarted: false
		});
		var killed = false;

		// keepalive can be an option or a flag (eg 'iisexpress:dist:keepalive')
		var keepAlive = this.flags.keepalive || options.keepalive;

		// If no entry point defined: run in the current dir
		if (options.config === undefined && options.site === undefined &&
			options.siteid === undefined && options.path === undefined) {
			options.path = '.';
		}

		// Convert options to command line parameter format
		var args = _.map(_.pairs(_.omit(options, ['cmd', 'keepalive', 'killOn', 'killOnExit', 'open', 'openPath', 'openUrl', 'verbose', 'waitUntilStarted'])), function(option) {
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
				grunt.log.write(data.toString());
			});
		}

		spawn.stderr.on('data', function (data) {
			grunt.warn(data.toString());
		});

		if (options.waitUntilStarted) {
			grunt.log.writeln('Waiting until IIS Express is running')

			var done = this.async();
			spawn.stdout.on('data', function (data) {
				if (data.toString().indexOf('IIS Express is running.') !== -1) {
					grunt.log.ok('Started IIS Express.');
					done();
				}
			});
		} else {
			grunt.log.ok('Started IIS Express.');
		}

		if (options.open===true) {
			if (!options.port && !options.openUrl) {
				grunt.fail.fatal('Must specify port or openUrl when open==true');
			}
			var url = options.openUrl || 'http://localhost:' + options.port + options.openPath;
			if (options.verbose) {
				grunt.log.writeln('opening', url);
			}

			var done = this.async();
			require('open')(url, function() {
				if (!keepAlive) {
					done();
				} else {
					grunt.log.writeln('Waiting forever...');
				}
			});
		}

		if (keepAlive && !done) {
			var waitForever = this.async(); // grunt will not finish the task
			grunt.log.writeln('Waiting forever...');
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
