var bag = require('bagofholding'),
  bob = require('./bob'),
  fs = require('fs'),
  p = require('path');

/**
 * Execute Bob with target args
 */
function exec() {

  var dir = p.join(__dirname, '..'),
    tools = JSON.parse(fs.readFileSync(p.join(__dirname, '../conf/tools.json'))),
    targets = process.argv.slice(2),
    custom,
    pkg,
    _bob;

  try {
    custom = JSON.parse(fs.readFileSync(p.join(process.cwd(), '.bob.json')));
  } catch (e) {
    // non-mandatory .bob.json custom config file doesn't exist
  }

  try {
    pkg = JSON.parse(fs.readFileSync(p.join(process.cwd(), 'package.json')));
  } catch (e) {
    // non-mandatory package.json custom config file doesn't exist
  }

  _bob = new bob(dir, tools, custom, pkg);

  function _exec() {
    _bob.build(targets, process.env.BOB_MODE, true, function (err, result) {
      if (err) {
        console.error('FAILURE | exit code: ' + result);
      } else {
        console.log('SUCCESS | exit code: ' + result);
      }
      process.exit(result);
    });
  }

  var commands = {
    '_versionup': {
      action: function() {
        _bob.versionUp();
      }
    },
    '_versionup-minor': {
      action: function() {
        _bob.versionUp('minor');
      }
    },
    '_versionup-major': {
      action: function() {
        _bob.versionUp('major');
      }
    },
    '_template': {
      action: function() {
        _bob.template();
      }
    }
  };

  // TODO: trap --help and pass it to make's help
  // handle special commands (prefixed with underscore)
  // Bob executes these commands without using the Makefile
  bag.cli.parse(commands, __dirname);

  // non-special commands are executed using Makefile
  if (targets.length > 1 || !targets[0].match(/^_.+/)) {
    _exec();
  }
}

exports.exec = exec;