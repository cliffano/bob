"use strict"
import canihaz from 'canihaz-pakkunbot';
import fs from 'fs';
import p from 'path';

const GLOBALS = ['npm'];

/**
 * Install dependency modules that are not yet installed, and needed for executing the tasks.
 * Global modules (like npm) are assumed to already exist.
 *
 * @param {Array} depNames: an array of dependency module names
 * @param {Object} optional:
 * - dir: application directory where node_modules dir is located
 * @param {Function} cb: standard cb(err, result) callback
 */
function install(depNames, opts, cb) {
  fs.readdir(p.join(opts.dir, 'node_modules'), (err, installed) => {
    if (err) { cb(err); }
    else {
      const uninstalled = [];
      depNames.forEach((depName) => {
        if (installed.indexOf(depName) === -1 &&
            uninstalled.indexOf(depName) === -1 &&
            GLOBALS.indexOf(depName) === -1) {
          uninstalled.push(depName);
        }
      });
      if (uninstalled.length > 0) {
        console.log('[deps] Installing modules: %s (might take a while, once-off only)', uninstalled .join(', '));
        canihaz.install({ key: 'optDependencies', location: opts.dir }).apply(this, uninstalled.concat(cb));
      } else {
        cb();
      }
    }
  });
}

const exports = {
  install: install
};

export {
  exports as default
};