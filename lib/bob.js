var _ = require('underscore'),
  bag = require('bagofholding'),
  config = require('./config'),
  make = require('./make'),
  p = require('path');

/**
 * class Bob
 *
 * @param {String} dir: Bob home directory
 * @param {Object} custom: userland custom configuration, to override Bob's default configuration
 * @param {Object} pkg: userland package.json
 */
function Bob(dir, custom, pkg) {
  this.dir = dir || '.';
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

  var makeFile = p.join(this.dir, 'bin', 'Makefile'),
    params = {
      app: process.cwd(),
      bob: this.dir,
      src: (this.custom.src) ? this.custom.src : process.cwd(),
      name: this.pkg.name,
      version: this.pkg.version
    },
    isOverridden,
    tasks,
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
    _.keys(tasks[target].overrides.pkg).forEach(function (override) {
      if (bag.obj.exist(tasks[target].overrides.pkg[override], self.pkg)) {
        targets[i] = override;
        isOverridden = true;
      }
    });
  }

  function _constructParams(target, targets, i) {
    // determine target type
    var type = bag.obj.exist(target + '.type', self.custom) ?
        self.custom[target].type : tasks[target]['default'],
      tool = tasks[target].types[type];

    // set target type, e.g. package_type: 'tar.gz'
    params[target + '_type'] = type;

    // set default tool properties, e.g. package_bin: 'tar'
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
  tasks = config.loadTasks(_.filter(targets, function (target) { return !target.match(/^\-/); } ));

  for (var i = 0, ln = targets.length; i < ln; i += 1) {
    var target = targets[i];
    isOverridden = false;

    if (tasks[target]) {
      // check for package.json overrides, replace original target if override exists
      if (tasks[target].overrides) {
        _checkOverrides(target, targets, i);
      }
      // if not overridden, then construct target parameters
      if (!isOverridden && tasks[target]['default']) {
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
  if (process.env.http_proxy) {
    opts._bob.proxy = process.env.http_proxy;
  }
  require('./targets/' + target).exec(opts, cb);
};

module.exports = Bob;