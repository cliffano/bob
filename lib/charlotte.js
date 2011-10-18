var fs = require('fs');

var Charlotte = function () {
};
Charlotte.prototype.versionup = function (type) {
    var conf = JSON.parse(fs.readFileSync('package.json')),
        version = conf.version.split('.');
    if (type === 'major') {
        version[0]++;
    } else if (type === 'minor') {
        version[1]++;
    } else {
        version[2]++;
    }
    conf.version = version.join('.');
    fs.writeFileSync('package.json', JSON.stringify(conf, null, 4));
    return conf.version;
};

exports.Charlotte = Charlotte;
