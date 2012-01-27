var _ = require('underscore'),
  fs = require('fs'),
  PackageJson = require('./packagejson').PackageJson,
  util = require('./util');

// Charlotte takes care of tasks that can't be done easily using Make from shell
function Charlotte() {
  
  var packageJson = new PackageJson('package.json');

  // read template file and populate variables with values from package file
  function template() {
    var pkg = packageJson.read();
    pkg.bob.template.forEach(function (file) {
      var data = fs.readFileSync(file).toString();
      fs.writeFileSync(file, util.apply(data, pkg));
    });
  }

  function versionUp(type) {
    return packageJson.versionUp(type);
  }

  return {
    template: template,
    versionUp: versionUp
  }
}

exports.Charlotte = Charlotte;