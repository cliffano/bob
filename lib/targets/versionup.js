var fs = require('fs'),
  p = require('path');

/**
 * Upgrade the version in package.json file based on type.
 * Version format is major.minor.patch .
 * If type is patch, then patch number is incremented by 1. E.g. 5.6.7 to 5.6.8
 * If type is minor, then minor number is incremented by 1, and patch number is reset to 0. E.g. 5.6.7 to 5.7.0
 * If type is major, then major number is incremented by 1, and minor and patch numbers are reset to 0. E.g. 5.6.7 to 6.0.0
 *
 * @param {Object} opts: standard target Bob options,
 *   _bob property contains userland package.json, custom configuration, and optional proxy
 *   the rest is this target's options:
 *   + type: version component, 'minor', 'major', or 'patch', defaults to 'patch' if unspecified
 * @param {Object} cb: standard cb(err, result) callback
 */
function exec(opts, cb) {

  var pkg = opts._bob.pkg,
    type = opts.type,
    version = ((pkg.version) ? pkg.version : '0.0.0').split('.');

  if (type === 'major') {
    version = [++version[0], 0, 0];
  } else if (type === 'minor') {
    version = [version[0], ++version[1], 0];
  } else {
    version = [version[0], version[1], ++version[2]];
  }

  pkg.version = version.join('.');  
  fs.writeFile(p.join(process.cwd(), 'package.json'), JSON.stringify(pkg, null, 2), function (err) {
    if (!err) {
      console.log('Version upgraded to ' + pkg.version);
    }
    cb(err);
  });
}

exports.exec = exec;