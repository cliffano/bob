var Bob = require('./bob').Bob,
  fs = require('fs'),
  nomnom = require('nomnom'),
  p = require('path');

function exec() {

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

exports.exec = exec;