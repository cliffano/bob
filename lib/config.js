var async = require('async'),
  fs = require('fs'),
  p = require('path');

/**
 * Load application config file.
 * Config file will be filtered, fields not in taskNames won't be .
 *
 * @param {Array} taskNames: an array of task names
 * @param {String} dir: base directory where config file is located
 * @param {Function} cb: standard cb(err, result) callback
 */
function load(taskNames, dir, cb) {
 
  // TODO: add validation 
  fs.readFile(p.join(dir, '.bob.json'), function (err, data) {
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
}

exports.load = load;