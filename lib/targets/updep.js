var _ = require('underscore'),
  async = require('async'),
  fs = require('fs'),
  p = require('path'),
  request = require('request');

/**
 * Upgrade all dependencies specified in userland package.json to latest version.
 * Latest versions are retrieved registry.npmjs.org .
 *
 * @param {Object} opts: standard target Bob options,
 *   _bob property contains userland package.json and custom configuration,
 */
function exec(opts) {

  var pkg = opts._bob.pkg,
    types = ['dependencies', 'devDependencies'],
    tasks = {};

  types.forEach(function (type) {
    if (pkg[type]) {
      _.keys(pkg[type]).forEach(function (dep) {
        tasks[dep] = function (cb) {
          request('https://registry.npmjs.org/' + dep + '/latest', function (err, res) {
            var currVersion = pkg[type][dep];
            if (!err && res.statusCode === 200) {
              var latestVersion = JSON.parse(res.body).version;
              console.log('%s - %s', 
                String.grey ? dep[(currVersion === latestVersion) ? 'grey' : 'green'] : dep,
                (currVersion === latestVersion) ?
                'already latest v' + currVersion :
                'upgrade to v' + latestVersion);
              cb(null , latestVersion);
            } else if (!err && res.statusCode === 404) {
              console.log('%s - not found', String.red ? dep.red : dep);
              cb();
            } else {
              cb(err || new Error('Unexpected status code ' + res.statusCode + ' from npm registry\nResponse body:\n' + res.body));
            }
          });
        };
      });
    }
  });

  async.series(tasks, function (err, results) {
    if (!err) {
      types.forEach(function (type) {
        if (pkg[type]) {
          _.keys(pkg[type]).forEach(function (dep) {
            if (results[dep]) {
              pkg[type][dep] = results[dep];
            }
          });
        }
      });
      fs.writeFileSync(p.join(process.cwd(), 'package.json'), JSON.stringify(pkg, null, 2));
    } else {
      console.error(err.message);
    }
  });
}

exports.exec = exec;