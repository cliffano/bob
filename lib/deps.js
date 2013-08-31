var canihaz = require('canihaz'),
  fs = require('fs'),
  p = require('path');

/**
 * Install dependency modules that are not yet installed, and needed for executing the tasks.
 *
 * @param {Array} depNames: an array of dependency module names
 * @param {String} dir: application directory where node_modules dir is located
 * @param {Function} cb: standard cb(err, result) callback
 */
function install(depNames, dir, cb) {
  fs.readdir(p.join(dir, 'node_modules'), function(err, installed) {
    var uninstalled = [];
    depNames.forEach(function (depName) {
      if (installed.indexOf(depName) === -1) {
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