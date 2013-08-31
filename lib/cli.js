var Bob = require('./bob'),
  cli = require('bagofcli'),
  colors = require('colors'),
  fs = require('fs'),
  p = require('path'),
  task = require('./task');

function _exec() {
  var tasks = [arguments[arguments.length - 1]._name],
    quiet = arguments[arguments.length - 1].parent.quiet;

  for (var i = 0, ln = arguments.length - 1; i < ln; i += 1) {
    tasks.push(arguments[i]);
  }

  var bob = new Bob({
    appDir: process.cwd(),
    bobDir: p.join(__dirname, '..'),
    bobMode: process.env.BOB_MODE || 'human',
    quiet: quiet
  });

  function errorCb(err) {
    if (err.code && !isNaN(err.code)) {
      console.error('%s | exit code: %d', 'FAILURE'.red || 'FAILURE', err.code);
      process.exit(err.code);
    } else {
      console.error('%s | message: %s', 'ERROR'.yellow || 'ERROR', err.message);  
    }
  }

  function successCb() {
    console.log('%s | exit code: 0', 'SUCCESS'.green || 'SUCCESS');
  }

  bob.build(tasks, cli.exitCb(errorCb, successCb));
}

/**
 * Execute Bob CLI.
 */
function exec() {
  var commands = Object.keys(JSON.parse(fs.readFileSync(p.join(__dirname, '..', 'conf', 'commands.json'))).commands),
    actions = { commands: {} };
  commands.forEach(function (command) {
    actions.commands[command] = { action: _exec };
  });
  cli.command(__dirname, actions);
}

exports.exec = exec;