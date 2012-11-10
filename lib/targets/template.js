var bag = require('bagofholding'),
  dateFormat = require('dateformat'),
  fs = require('fs');

/**
 * Apply template files configured in custom .bob.json config file.
 * Template files will be populated with properties from package.json file along with utility functions:
 *   + now(format): current date with specified format
 *
 * @param {Object} opts: standard target Bob options,
 *   _bob property contains userland package.json and custom configuration,
 *   the rest is this target's options
 */
function exec(opts) {

  var custom = opts._bob.custom,
    pkg = opts._bob.pkg;

  if (custom.template) {
    custom.template.forEach(function (file) {

      var text = fs.readFileSync(file, 'utf-8'),
        params = pkg;

      params.now = function (format, cb) {
        cb(dateFormat(new Date(), format));
      };

      fs.writeFileSync(file, bag.text.apply(text, pkg), 'utf-8');
    });
  }
}

exports.exec = exec;