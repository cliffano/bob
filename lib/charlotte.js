var fs = require('fs');

function Charlotte() {

    function versionup(type) {
        var CONF_FILE = 'package.json',
            conf = JSON.parse(fs.readFileSync(CONF_FILE)),
            version = ((conf.version) ? conf.version : '0.0.0').split('.');
        if (type === 'major') {
            version[0]++;
        } else if (type === 'minor') {
            version[1]++;
        } else {
            version[2]++;
        }
        conf.version = version.join('.');
        fs.writeFileSync(CONF_FILE, JSON.stringify(conf, null, 4));
        return conf.version;
    }

    return {
        'versionup': versionup
    }
};

exports.Charlotte = Charlotte;
