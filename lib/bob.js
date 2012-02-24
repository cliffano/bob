var _ = require('underscore'),
  fs = require('fs'),
  Make = require('./make').Make,
  p = require('path'),
  PackageJson = require('./packagejson').PackageJson,
  util = require('./util'),
  valentine = require('valentine');

// Bob takes care of executing Make with specified params and targets
function Bob(opts) {
  
  var makeJson = JSON.parse(fs.readFileSync(p.join(opts.bobDir, 'conf/make.json'))),
    packageJson = new PackageJson('package.json'),
    pkg = packageJson.read();

  // prepare parameters
  function _params() {

    // keys: Makefile params in underscore-separated uppercase format
    // config: configuration values in package.json and mode file
    var keys = makeJson.params,
      config = valentine.extend(pkg, JSON.parse(fs.readFileSync(p.join(opts.bobDir, 'conf/mode/' + opts.mode + '.json')))),
      params = [];

    // each key FOO_BAR coresponds to pkg's { foo: { bar: '' }}
    keys.BOB_DIR = { 'default': opts.bobDir };
    keys.APP_DIR = { 'default': opts.appDir };
    keys.NODE_ENV = { 'default': (process.env.NODE_ENV || 'development') };

    _.keys(keys).forEach(function (key) {
      var props = key.toLowerCase().replace(/_/g, '.'),
        value = util.apply(util.val(props, pkg), pkg);

      // use value in package.json as priority
      if (value !== undefined) {
        params[key] = value;

      // use type-based value if bob.<target>.type is supplied
      } else if (props.match(/^bob\./) &&
          props.split('.').length >= 3 &&
          keys[key][util.val(props.replace(/\.[^\.]+$/, '.type'), pkg)]) {
        params[key] = keys[key][util.val(props.replace(/\.[^\.]+$/, '.type'), pkg)];

      // use default value as last resort
      } else if (keys[key]['default']) {
        params[key] = keys[key]['default'];
      }

    });

    return params;
  }

  // prepare targets
  function _targets(targets) {

    var keys = makeJson.targets;

    _.keys(keys).forEach(function (key) {
      // replace target if an override target is provided and
      // a corresponding property exists in package.json
      var pos = targets.indexOf(key);
      if (pos !== -1 && keys[key].override && util.val(keys[key].override.prop, pkg)) {
        targets[pos] = keys[key].override.target;
      }
    });

    return targets;
  }

  function build(targets, cb) {
    (new Make(opts)).exec(_params(), _targets(targets), cb);
  }

  return {
    build: build
  };
}

exports.Bob = Bob;