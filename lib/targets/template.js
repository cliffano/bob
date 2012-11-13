var bag = require('bagofholding'),
  dateFormat = require('dateformat'),
  fs = require('fs');

/**
 * Apply template files configured in custom .bob.json config file.
 * Template files will be populated with properties from package.json file along with utility functions:
 *   + now(format): current date with specified format
 *
 * @param {Object} opts: standard target Bob options,
 *   _bob property contains userland package.json, custom configuration, and optional proxy
 *   the rest is this target's options
 * @param {Object} cb: standard cb(err, result) callback
 */
function exec(opts, cb) {

  var custom = opts._bob.custom,
    pkg = opts._bob.pkg;

  if (custom.template) {
    custom.template.forEach(function (file) {

      var text = fs.readFileSync(file, 'utf-8'),
        params = pkg;

      params.now = function (format, cb) {
        cb(dateFormat(new Date(), format));
      };

      fs.writeFile(file, bag.text.apply(text, pkg), cb);
    });
  } else {
    cb();
  }
}

exports.exec = exec;