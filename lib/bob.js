var _ = require('underscore'),
  fs = require('fs'),
  jquery = require('jquery'),
  Make = require('./make').Make,
  p = require('path'),
  PackageJson = require('./packagejson').PackageJson,
  util = require('./util');

// Bob takes care of executing Make with specified params and targets
function Bob(opts) {
  
  var packageJson = new PackageJson('package.json'),
    pkg = packageJson.read();

  function _params() {

    // keys: Makefile params in underscore-separated uppercase format
    // config: configuration values in package.json and mode file
    var keys = JSON.parse(fs.readFileSync(p.join(opts.bobDir, 'conf/keys.json'))),
      config = jquery.extend(true, pkg,
        JSON.parse(fs.readFileSync(p.join(opts.bobDir, 'conf/mode/' + opts.mode + '.json')))),
      params = [];
      
    // prepare params based on configured keys
    // each key FOO_BAR coresponds to pkg's { foo: { bar: '' }}
    keys.BOB_DIR = { default: opts.bobDir };
    keys.APP_DIR = { default: opts.appDir };
    keys.NODE_ENV = { default: (process.env.NODE_ENV || 'development') };
    _.keys(keys).forEach(function (key) {
      var props = key.toLowerCase().split('_'),
        value;

      props.forEach(function (prop) {
        value = (value) ? value[prop] : config[prop];
      });
      // apply params to parameterised values
      value = util.apply(value, pkg);

      if (value !== undefined) {
        params[key] = value;
      } else if (keys[key].default) {
        params[key] = keys[key].default;
      }
    });

    return params;
  }

  function build(targets, cb) {
// TODO: targets handling (override, module-specific target)
    (new Make(opts)).exec(_params(), targets, cb);
  }

  return {
    build: build
  }
}

exports.Bob = Bob;

/*
var child_process = require('child_process'),
    path = require('path'),
    OVERRIDE_TASKS = [
        { orig: 'test', prop: 'scripts.test', repl: 'test-npm' },
        { orig: 'stop', prop: 'scripts.stop', repl: 'stop-npm' },
        { orig: 'start', prop: 'scripts.start', repl: 'start-npm' },
        { orig: 'restart', prop: 'scripts.restart', repl: 'restart-npm' }
        ];

function Bob(toolbelt, conf) {

    function plan(tasks) {
        var i, ln;
        function check(oTask) {
            if (oTask.orig === tasks[i] && toolbelt.val(conf, oTask.prop)) {
                tasks[i] = oTask.repl;
            }
        }
        for (i = 0, ln = tasks.length; i < ln; i += 1) {
            OVERRIDE_TASKS.forEach(check);
        }
        return tasks;
    }

    function build(bobDir, params, targets) {
        var command = 'make',
            args = ['-f', path.join(bobDir, 'conf/Makefile')]
                .concat(toolbelt.args(conf, params), targets),
            spawn = child_process.spawn(command, args);
        //console.error('Args: ' + args.join(' '));
        spawn.stdout.on('data', function (data) {
            process.stdout.write(data + ' ');
        });
        spawn.stderr.on('data', function (data) {
            process.stderr.write(data + ' ');
        });
        spawn.on('exit', function (code) {
            console.log(((code === 0) ? 'SUCCESS' : 'FAILURE') + ' (Exit code: ' + code + ')');
            process.exit(code);
        });
    }

    return {
        plan: plan,
        build: build
    };
}

exports.Bob = Bob;
*/