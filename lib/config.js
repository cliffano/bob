/**
 * Bob configuration loading module.
 * Handles loading and filtering of Bob configuration files.
 *
 * @module config
 */
"use strict";
import fs from "fs";
import p from "path";

/**
 * Load and filter Bob application configuration file.
 * Config file will be filtered; fields not in taskNames will be removed.
 *
 * @param {Array} taskNames: an array of task names
 * @param {String} dir: base directory where config file is located
 * @param {Function} cb: standard cb(err, result) callback
 */
function load(taskNames, dir, cb) {
  const file = p.join(dir, ".bob.json");
  // TODO: add validation
  fs.exists(file, (exists) => {
    if (exists) {
      fs.readFile(file, (err, data) => {
        if (!err) {
          data = JSON.parse(data);
          Object.keys(data).forEach((key) => {
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
  load: load,
};

export { exports as default };
