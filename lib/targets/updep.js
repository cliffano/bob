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
 *   _bob property contains userland package.json, custom configuration, and optional proxy
 * @param {Object} cb: standard cb(err, result) callback
 */
function exec(opts, cb) {

  var pkg = opts._bob.pkg,
    types = ['dependencies', 'devDependencies'],
    tasks = {};

  types.forEach(function (type) {
    if (pkg[type]) {
      _.keys(pkg[type]).forEach(function (dep) {
        tasks[dep] = function (cb) {

          var params = {
            method: 'GET',
            uri: 'https://registry.npmjs.org/' + dep + '/latest'
          };
          if (opts._bob.proxy) {
            params.proxy = opts._bob.proxy;
          }

          request(params, function (err, res) {
            var currVersion = pkg[type][dep];
            if (!err && res.statusCode === 200) {
              var latestVersion = JSON.parse(res.body).version;
              console.log('%s - %s', 
                dep[(currVersion === latestVersion) ? 'grey' : 'green'] || dep,
                (currVersion === latestVersion) ?
                'already latest v' + currVersion :
                'upgrade to v' + latestVersion);
              cb(null , latestVersion);
            } else if (!err && res.statusCode === 404) {
              console.log('%s - not found', dep.red || dep);
              cb();
            } else {
              cb(err || new Error('Unexpected status code ' + res.statusCode + ' from npm registry\nResponse body:\n' + res.body));
            }
          });
        };
      });
    }
  });

  async.parallel(tasks, function (err, results) {
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
      fs.writeFile(p.join(process.cwd(), 'package.json'), JSON.stringify(pkg, null, 2), cb);
    } else {
      cb(err);
    }
  });
}

exports.exec = exec;
