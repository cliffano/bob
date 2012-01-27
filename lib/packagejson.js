var fs = require('fs');

// manages the application's package.json file
function PackageJson(file) {
  
  // load package file as JSON object
  function read() {
  	return JSON.parse(fs.readFileSync(file));
  }

  // write JSON object into package file
  function write(pkg) {
  	fs.writeFileSync(file, JSON.stringify(pkg, null, 2));
  }

  // bump up major/minor/build number of package version
  function versionUp(type) {
  	var pkg = read(),
  	  version = ((conf.version) ? conf.version : '0.0.0').split('.');
    if (type === 'major') {
      version = [version[0] += 1, 0, 0];
    } else if (type === 'minor') {
    	version = [version[0], version[1] += 1, 0];
    } else {
      version = [version[0], version[1], version[2] += 1];
    }
    pkg.version = version.join('.');
    write(pkg);
    return pkg.version;
  }

  return {
  	read: read,
  	versionUp: versionUp,
  	write: write
  };
}

exports.PackageJson = PackageJson;