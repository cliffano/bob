var _ = require('underscore'),
  bag = require('bagofholding'),
  Bob = require('./bob'),
  colors = require('colors'),
  config = require('./config'),
  fs = require('fs'),
  p = require('path');

/**
 * Execute Bob with target args
 */
function exec() {

  var dir = p.join(__dirname, '..'),
    targets = process.argv.slice(2),
    tools = config.loadTasks(_.filter(targets, function (target) { return !target.match(/^\-/); } )),
    pkgFile = p.join(process.cwd(), 'package.json'),
    custom = config.loadCustom(),
    pkg = config.loadPackage(),
    bob = new Bob(dir, tools, custom, pkg);

  function _external() {
    var verbose = false,
      pos = targets.indexOf('--verbose');
    if (pos >= 0) {
      targets = targets.splice(pos - 1, 1);
      verbose = true;
    }
    bob.external(targets, process.env.BOB_MODE, verbose, function (err, result) {
      if (err) {
        console.error('%s | exit code: %d', 'FAILURE'.red || 'FAILURE', result);
      } else {
        console.log('%s | exit code: %d', 'SUCCESS'.green || 'SUCCESS', result);
      }
      process.exit(result);
    });
  }

  function _internal(target, opts) {
    opts = opts || {};
    return function() {
      bob.internal(target, opts, bag.cli.exit);
    };
  }

  var commands = {
      '_updep': { action: _internal('updep') },
      '_versionup': { action: _internal('versionup') },
      '_versionup-minor': { action: _internal('versionup', { type: 'minor' }) },
      '_versionup-major': { action: _internal('versionup', { type: 'major' }) },
      '_template': { action: _internal('template') }
    },
    options = [
      { 
        arg: '--verbose',
        desc: 'Display verbose output, including make arguments and shell commands.',
        action: function (value) { return value === 'true'; }
      }
    ];

  // TODO: trap --help and pass it to make's help, or a custom help that combines private and public commands
  // handle internal target (prefixed with underscore), Bob executes these targets without using the Makefile
  // since internal targets are only called from Bob's own Makefile, Bob will only call one internal target at a time, never multiple
  bag.cli.parse(commands, __dirname, options);

  // external targets are executed using Makefile
  if (targets.length > 1 || !targets[0].match(/^_.+/)) {
    _external();
  }
}

exports.exec = exec;