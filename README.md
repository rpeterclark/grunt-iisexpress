# grunt-iisexpress

> Start an IIS Express process.

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-iisexpress --save-dev
```

One the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-iisexpress');
```

## iisexpress task

### Overview
In your project's Gruntfile, add a section named `iisexpress` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  iisexpress: {
    server: {
      port: 3000
    }
  }
});
```

### Options

#### options.cmd
Type: `String`
Default value: `c:/program files/iis express/iisexpress.exe`

A string value that specifies the location of the IIS Express executable.

#### options.killOn
Type: `String`
Default value: `''`

A string value that is used to determine when the IIS Express process should be killed. The IIS Express process will not automatically terminate when Grunt exits. This may be your desired behavior. If, however, you *do* want the IIS Express process to terminate, you will have to specify the name of an event for it to trigger the process kill.

### IIS Express Options

Refer to the [IIS Express](http://www.iis.net/learn/extensions/using-iis-express/running-iis-express-from-the-command-line) command line documentation for the following options.

#### options.path
Type: `String`
Default value: `require('path').resolve('.')`

The full physical path of the application to run. You cannot combine this option with the `config` and related options.

#### options.port
Type: `Integer`
Default value: `8080`

The port to which the application will bind. The default value is `8080`. You must also specify the `path` option.

#### options.clr
Type: `String`
Default value: `v4.0`

The .NET Framework version (e.g. `v2.0`) to use to run the application. The default value is `v4.0`. You must also specify the `path` option.

#### options.config
Type: `String`
Default value: `null`

The full path to the `applicationhost.config` file. The default value is the `IISExpress8\config\applicationhost.config` file that is located in the user's Documents folder.

#### options.site
Type: `String`
Default value: `null`

The name of the site to launch, as described in the `applicationhost.config` file.

#### options.siteid
Type: `String`
Default value: `null`

The ID of the site to launch, as described in the `applicationhost.config` file.

#### options.systray
Type: `Boolean`
Default value: `true`

Enables or disables the system tray application. The default value is `true`.

#### options.trace
Type: `String`
Default value: `null`

Valid values are `info` or `i`, `warning` or `w`, `error` or `e`. 

### Usage Examples

#### Basic Use
In this example, `grunt iisexpress` will start an IIS Express server at `http://localhost:8000/`, with its base path set to the root directory relative to the gruntfile, and any tasks run afterwards will be able to access it.

```js
grunt.initConfig({
  iisexpress: {
    server: {
      port: 8000
    }
  }
});
```

If you want your web server to use the default options, just omit the `options` object. You still need to specify a target (`uses_defaults` in this example), but the target's configuration object can otherwise be empty or nonexistent. In this example, `grunt iisexpress` will start a web server using the default options.

```js
grunt.initConfig({
  iisexpress: {
    uses_defaults: {}
  }
});
```

#### Killing IIS Express
The IIS Express process will not automatically terminate when Grunt exits. This may be your desired behavior. If, however, you *do* want the IIS Express process to terminate, you will have to specify the name of an event to trigger the process kill.

You may be able to listen to an event emitted by another Grunt plugin that you are using. For example, to kill IIS Express after running [grunt-contrib-qunit](https://github.com/gruntjs/grunt-contrib-qunit/) tests:

```js
grunt.initConfig({
  iisexpress: {
    server: {
      port: 8000,
      killOn: 'qunit.done'
    }
  },
  qunit: {
    test: {
      options: {
        urls: ['http://localhost/test/foo.html']
      }
    }
  }
});

```

If there is not an event available for you to use, you can register a small custom task with Grunt:

```js
grunt.initConfig({
  iisexpress: {
    server: {
      port: 8000,
      killOn: 'mytasks.done'
    }
  }
});

grunt.registerTask('iisexpress-killer', function(){
  grunt.event.emit('mytasks.done');
});

grunt.registerTask('default', ['iisexpress', 'iisexpress-killer']);
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
