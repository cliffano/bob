var _ = require('underscore'),
  bag = require('bagofholding'),
  dateFormat = require('dateformat'),
  fs = require('fs'),
  make = require('./make'),
  p = require('path');

/**
 * class Bob
 *
 * @param {String} dir: Bob home directory
 * @param {Object} tools: Bob's tools configuration
 * @param {Object} custom: userland custom configuration, to override Bob's default configuration
 * @param {Object} pkg: userland package.json
 */
function Bob(dir, tools, custom, pkg) {
  this.dir = dir || '.';
  this.tools = tools || {};
  this.custom = custom || {};
  this.pkg = pkg || {};
}

/**
 * Bob performs the build by executing Make.
 *
 * @param {Array} targets: build targets
 * @param {String} mode: 'human' or 'robot', default to 'human'
 * @param {Bolean} verbose: log output verbosity
 */
Bob.prototype.build = function (targets, mode, verbose, cb) {

  var mode = mode || 'human',
    makeFile = p.join(this.dir, 'conf', 'Makefile'),
    params = {
      app: process.cwd(),
      bob: this.dir,
      src: (this.custom.src) ? this.custom.src : process.cwd(),
      name: this.pkg.name,
      version: this.pkg.version
    },
    self = this;

  for (var i = 0, ln = targets.length; i < ln; i += 1) {

    var target = targets[i],
      isOverridden = false,
      tool;

    if (this.tools[target] && this.tools[target].default) {

      // check for package.json overrides, replace original target if override exists
      if (this.tools[target].overrides) {
        _.keys(this.tools[target].overrides.pkg).forEach(function (override) {
          if (bag.obj.exist(self.tools[target].overrides.pkg[override], self.pkg)) {
            targets[i] = override;
            isOverridden = true;
          }
        });
      }

      // if not overridden, then construct target parameters
      if (!isOverridden) {

        // determine target type
        tool = this.tools[target].types[
            bag.obj.exist(target + '.type', this.custom) ?
              this.custom[target].type :
              this.tools[target].default
          ];

        // set default tool properties
        _.keys(tool).forEach(function (prop) {
          if (typeof tool[prop] === 'object') {
            params[target + '_' + prop] = tool[prop][mode];
          } else {
            params[target + '_' + prop] = tool[prop];
          }
        });

        // override default with custom properties
        if (this.custom[target]) {
          _.keys(this.custom[target]).forEach(function (prop) {
            if (prop != 'type') {
              params[target + '_' + prop] = self.custom[target][prop];
            }
          });
        }
      }
    }
  };

  new make(makeFile, verbose).exec(params, targets, cb);
};

/**
 * Upgrade the version in package.json file based on type.
 * Version format is major.minor.build .
 * If format is build, then build number is incremented by 1. E.g. 5.6.7 to 5.6.8
 * If format is minor, then minor number is incremented by 1, and build number is reset to 0. E.g. 5.6.7 to 5.7.0
 * If format is major, then major number is incremented by 1, and minor and build numbers are reset to 0. E.g. 5.6.7 to 6.0.0
 *
 * @param {String} type: version type: 'minor', 'major', or 'build', defaults to 'build' if unspecified
 */
Bob.prototype.versionUp = function (type) {

  var version = ((this.pkg.version) ? this.pkg.version : '0.0.0').split('.');

  if (type === 'major') {
    version = [++version[0], 0, 0];
  } else if (type === 'minor') {
    version = [version[0], ++version[1], 0];
  } else {
    version = [version[0], version[1], ++version[2]];
  }

  this.pkg.version = version.join('.');  
  fs.writeFileSync(p.join(process.cwd(), 'package.json'), JSON.stringify(this.pkg, null, 2));
  console.log('Version upgraded to ' + this.pkg.version);

  return this.pkg.version;
};

/**
 * Apply template files configured in custom .bob.json config file.
 * Template files will be populated with properties from package.json file along with utility functions:
 * - now(format): current date with specified format
 */
Bob.prototype.template = function () {

  var self = this;

  if (this.custom.template) {
    this.custom.template.forEach(function (file) {

      var params = self.pkg,
        text = fs.readFileSync(file, 'utf-8');

      params.now = function (format, cb) {
        cb(dateFormat(new Date(), format));
      };

      fs.writeFileSync(file, bag.text.apply(text, params), 'utf-8');

    });
  }
};

module.exports = Bob;