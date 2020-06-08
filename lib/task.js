"use strict"
import async from 'async';
import fs from 'fs';
import p from 'path';
import util from 'util';

/**
 * Load Bob task files in parallel.
 * Only task files in specified taskNames will be loaded.
 *
 * @param {Array} taskNames: an array of task names
 * @param {String} dir: base directory where task files are located
 * @param {Function} cb: standard cb(err, result) callback
 */
function load(taskNames, dir, cb) {
  
  var jobs = {};

  taskNames.forEach(function (taskName) {
    jobs[taskName] = function (cb) {
      var file = p.join(dir, taskName + '.json');
      fs.access(file, fs.constants.F_OK, function (err) {
        if (err) {
          var _err = new Error(util.format('Unknown command: %s, use --help for more info', taskName));
          cb(_err);
        } else {
          fs.readFile(file, cb);
        }
      });
    };
  });
  
  function parse(err, results) {
    if (!err) {
      Object.keys(results).forEach(function (taskName) {
        results[taskName] = JSON.parse(results[taskName]);
      });
    }
    cb(err, results);
  }

  async.parallel(jobs, parse);
}

const exports = {
  load: load
};

export {
  exports as default
};