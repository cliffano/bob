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

  mode = mode || 'human';

  var makeFile = p.join(this.dir, 'conf', 'Makefile'),
    params = {
      app: process.cwd(),
      bob: this.dir,
      src: (this.custom.src) ? this.custom.src : process.cwd(),
      name: this.pkg.name,
      version: this.pkg.version
    },
    isOverridden,
    self = this;

  function _checkOverrides(target, targets, i) {    
    _.keys(self.tools[target].overrides.pkg).forEach(function (override) {
      if (bag.obj.exist(self.tools[target].overrides.pkg[override], self.pkg)) {
        targets[i] = override;
        isOverridden = true;
      }
    });
  }

  function _constructParams(target, targets, i) {
    // determine target type
    var tool = self.tools[target].types[
        bag.obj.exist(target + '.type', self.custom) ?
          self.custom[target].type :
          self.tools[target]['default']
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
    if (self.custom[target]) {
      _.keys(self.custom[target]).forEach(function (prop) {
        if (prop != 'type') {
          params[target + '_' + prop] = self.custom[target][prop];
        }
      });
    }
  }

  for (var i = 0, ln = targets.length; i < ln; i += 1) {
    var target = targets[i];
    isOverridden = false;

    if (this.tools[target]) {
      // check for package.json overrides, replace original target if override exists
      if (self.tools[target].overrides) {
        _checkOverrides(target, targets, i);
      }
      // if not overridden, then construct target parameters
      if (!isOverridden && this.tools[target]['default']) {
        _constructParams(target, targets, i);
      }
    }
  }

  new make(makeFile, verbose).exec(params, targets, cb);
};

/**
 * Upgrade the version in package.json file based on type.
 * Version format is major.minor.patch .
 * If type is patch, then patch number is incremented by 1. E.g. 5.6.7 to 5.6.8
 * If type is minor, then minor number is incremented by 1, and patch number is reset to 0. E.g. 5.6.7 to 5.7.0
 * If type is major, then major number is incremented by 1, and minor and patch numbers are reset to 0. E.g. 5.6.7 to 6.0.0
 *
 * @param {String} type: version component: 'minor', 'major', or 'patch', defaults to 'patch' if unspecified
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