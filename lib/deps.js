var canihaz = require('canihaz'),
  fs = require('fs'),
  p = require('path');

const GLOBALS = ['npm'];

/**
 * Install dependency modules that are not yet installed, and needed for executing the tasks.
 * Global modules (like npm) are assumed to already exist.
 *
 * @param {Array} depNames: an array of dependency module names
 * @param {String} dir: application directory where node_modules dir is located
 * @param {Function} cb: standard cb(err, result) callback
 */
function install(depNames, dir, cb) {
  fs.readdir(p.join(dir, 'node_modules'), function(err, installed) {
    var uninstalled = [];
    depNames.forEach(function (depName) {
      if (installed.indexOf(depName) === -1 && GLOBALS.indexOf(depName) === -1) {
        uninstalled.push(depName);
      }
    });
    if (uninstalled.length > 0) {
      console.log('[deps] Installing modules: %s (might take a while, once-off only)', uninstalled .join(', '));
      canihaz({ key: 'optDependencies' }).apply(this, depNames.concat(cb));
    } else {
      cb();
    }
  });
}

exports.install = install;