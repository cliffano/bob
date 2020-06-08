"use strict"
import Bob from './bob.js';
import cli from 'bagofcli';
import fs from 'fs';
import os from 'os';
import p from 'path';

const APP_DIR = process.cwd(),
  DIRNAME = p.dirname(import.meta.url).replace('file://', ''),
  BOB_DIR = p.join(DIRNAME, '..');

function _exec() {

  const commandAndFirstTaskArg = arguments[0],
    remainingTasksArg = arguments[1] || [],
    quiet = commandAndFirstTaskArg.parent && commandAndFirstTaskArg.parent.quiet,
    tasks = [commandAndFirstTaskArg._name].concat(remainingTasksArg),
    pkgFile = p.join(APP_DIR, 'package.json'),
    pkg = JSON.parse(fs.readFileSync(pkgFile)),
    bob = new Bob({
      appDir: APP_DIR,
      appName: pkg.name,
      appVersion: pkg.version,
      bobDir: BOB_DIR,
      bobMode: process.env.BOB_MODE || 'human',
      maxBufferInKb: 1000,
      tmpDir: p.join(os.tmpdir(), '.bob', pkg.name),
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

  const commandFile = p.join(BOB_DIR, 'conf', 'commands.json'),
    commands = Object.keys(JSON.parse(fs.readFileSync(commandFile)).commands),
    configFile = p.join(APP_DIR, '.bob.json'),
    config = fs.existsSync(configFile) ? JSON.parse(fs.readFileSync(configFile)) : {},
    actions = { commands: {} };

  // replace aliases with tasks
  let argv = process.argv.slice(0, 2);
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

  cli.command(DIRNAME, actions);
}

const exports = {
  exec: exec
};

export {
  exports as default
};