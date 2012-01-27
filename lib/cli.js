var Bob = require('./bob').Bob,
  Charlotte = require('./charlotte').Charlotte,
  fs = require('fs'),
  nomnom = require('nomnom'),
  p = require('path');

function _bob() {

  var appDir = process.cwd(),
    bobDir = p.join(__dirname, '..'),
    bob = new Bob({
      appDir: appDir,
      bobDir: bobDir,
      mode: process.env.BOB_MODE || 'human'
    });

  nomnom.scriptName('bob').opts({
    version: {
      string: '-v',
      flag: true,
      help: 'Bob version number',
      callback: function () {
        return JSON.parse(fs.readFileSync(p.join(__dirname, '../package.json'))).version;
      }
    }
  });

  // parse command-line args and pass it to Bob as build targets
  bob.build(nomnom.parse()._, function (err, result) {
    console.log(result.status + ' | exit code: ' + result.code);
    process.exit(result.code);
  });
}

function _charlotte() {
  
  var charlotte = new Charlotte();

  nomnom.scriptName('charlotte');

  nomnom.command('versionup').callback(function (args) {
    console.log('Bump version up to ' + charlotte.versionUp());
  });
  nomnom.command('versionup-minor').callback(function (args) {
    console.log('Bump version up to ' + charlotte.versionUp('minor'));
  });
  nomnom.command('versionup-major').callback(function (args) {
    console.log('Bump version up to ' + charlotte.versionUp('major'));
  });
  nomnom.command('template').callback(function (args) {
    charlotte.template();
  });

  nomnom.parseArgs();
}

function exec(mode) {
  if (mode === 'bob') {
    _bob();
  } else {
    _charlotte();
  }
}

exports.exec = exec;