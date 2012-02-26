var fs = require('fs'),
  p = require('path'),
  PackageJson = require('./packagejson').PackageJson,
  packageJson = new PackageJson('package.json'),
  valentine = require('valentine');

// configuration is a combination of package.json file, conf/mode/ file, and project config .bob.json file
function Config(opts) {
 
  function read() {

    function _readJson(file) {
      var data;
      try {
        data = (fs.statSync(file).isFile()) ? JSON.parse(fs.readFileSync(file)) : {};
      } catch (e) {
        data = {};
      }
      return data;
    }

    return valentine.extend(
      packageJson.read(),
      _readJson(p.join(opts.bobDir, 'conf/mode/' + opts.mode + '.json')),
      _readJson(p.join(opts.appDir, '.bob.json')));
  }

  return {
    read: read
  };
}

exports.Config = Config;