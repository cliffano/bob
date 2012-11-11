var _ = require('underscore'),
  bag = require('bagofholding'),
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
 * Bob build external targets by executing Make.
 *
 * @param {Array} targets: build targets
 * @param {String} mode: 'human' or 'robot', default to 'human'
 * @param {Bolean} verbose: log output verbosity
 */
Bob.prototype.external = function (targets, mode, verbose, cb) {

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

  function _checkAliases(targets) {
    var checked = [];
    targets.forEach(function (target) {
      if (self.custom[target] && _.isString(self.custom[target])) {
        checked = checked.concat(self.custom[target].trim().replace(/(\s)+/, ' ').split(' '));
      } else {
        checked.push(target);
      }
    });
    return checked;
  }

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

  targets = _checkAliases(targets);

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
 * Internal target is implemented within Bob, and
 * is not executed using shell commands via Make.
 * This type of target is only called by Bob itself.
 *
 * Userland package.json and custom configuration are
 * added to opts as _bob property.
 *
 * @param {String} target: private build target
 * @param {Object} opts: options to be passed to target function
 * @param {Object} cb: standard cb(err, result) callback
 */
Bob.prototype.internal = function (target, opts, cb) {
  opts = opts || {};
  opts._bob = { pkg: this.pkg, custom: this.custom };
  require('./targets/' + target).exec(opts, cb);
};

module.exports = Bob;