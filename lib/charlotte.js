var _ = require('underscore'),
  Config = require('./config').Config,
  fs = require('fs'),
  PackageJson = require('./packagejson').PackageJson,
  util = require('./util');

// Charlotte takes care of tasks that can't be done easily using Make from shell
function Charlotte(opts) {

  var config = new Config(opts).read(),
    packageJson = new PackageJson('package.json');
    
  // read template file and populate variables with values from package file
  function template() {
    config.bob.template.forEach(function (file) {
      var data = fs.readFileSync(file).toString();
      fs.writeFileSync(file, util.apply(data, config));
    });
  }

  function versionUp(type) {
    return packageJson.versionUp(type);
  }

  return {
    template: template,
    versionUp: versionUp
  };
}

exports.Charlotte = Charlotte;