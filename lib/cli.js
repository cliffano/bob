var Bob = require('./bob'),
  cli = require('bagofcli'),
  colors = require('colors'),
  fs = require('fs'),
  p = require('path'),
  task = require('./task');

const APP_DIR = process.cwd(),
  BOB_DIR = p.join(__dirname, '..');

function _exec() {
  var lastArg = arguments[arguments.length - 1],
    tasks = [lastArg._name],
    quiet = lastArg.parent && lastArg.parent.quiet;

  for (var i = 0, ln = arguments.length - 1; i < ln; i += 1) {
    tasks.push(arguments[i]);
  }

  var pkgFile = p.join(APP_DIR, 'package.json'),
    pkg = JSON.parse(fs.readFileSync(pkgFile)),
    bob = new Bob({
      appDir: APP_DIR,
      appName: pkg.name,
      appVersion: pkg.version,
      bobDir: BOB_DIR,
      bobMode: process.env.BOB_MODE || 'human',
      quiet: quiet
    });

  function errorCb(err) {
    if (err.code && !isNaN(err.code)) {
      console.error('%s | exit code %d', 'FAILURE'.red, err.code);
      process.exit(err.code);
    } else {
      console.error('%s | %s', 'ERROR'.red, err.message);  
    }
  }

  function successCb() {
    console.log('%s | exit code 0', 'SUCCESS'.green);
  }

  bob.build(tasks, cli.exitCb(errorCb, successCb));
}

/**
 * Execute Bob CLI.
 */
function exec() {

  var commandFile = p.join(BOB_DIR, 'conf', 'commands.json'),
    commands = Object.keys(JSON.parse(fs.readFileSync(commandFile)).commands),
    configFile = p.join(APP_DIR, '.bob.json'),
    config = fs.existsSync(configFile) ? JSON.parse(fs.readFileSync(configFile)) : {},
    actions = { commands: {} };

  // replace aliases with tasks
  var argv = process.argv.slice(0, 2);
  process.argv.slice(2, process.argv.length).forEach(function (arg) {
    if (Object.keys(config).indexOf(arg) !== -1 && commands.indexOf(arg) === -1) {
      argv = argv.concat(config[arg].split(' '));
    } else {
      argv.push(arg);
    }
  });
  process.argv = argv;

  commands.forEach(function (command) {
    actions.commands[command] = { action: _exec };
  });

  cli.command(__dirname, actions);
}

exports.exec = exec;