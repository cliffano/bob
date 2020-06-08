"use strict"
import fs from 'fs';
import p from 'path';

/**
 * Load application config file if exists, otherwise ignore.
 * Config file will be filtered, fields not in taskNames won't be .
 *
 * @param {Array} taskNames: an array of task names
 * @param {String} dir: base directory where config file is located
 * @param {Function} cb: standard cb(err, result) callback
 */
function load(taskNames, dir, cb) {
  var file = p.join(dir, '.bob.json');
  // TODO: add validation 
  fs.exists(file, function (exists) {
    if (exists) {
      fs.readFile(file, function (err, data) {
        if (!err) {
          data = JSON.parse(data);
          Object.keys(data).forEach(function (key) {
            if (taskNames.indexOf(key) === -1) {
              delete data[key];
            }
          });
        }
        cb(err, data);
      });
    } else {
      cb(null, {});
    }
  });
}

const exports = {
  load: load
};

export {
  exports as default
};