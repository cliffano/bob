var _ = require('underscore'),
    fs = require('fs');

function Charlotte() {

    var CONF_FILE = 'package.json',
        conf = JSON.parse(fs.readFileSync(CONF_FILE));

    function versionup(type) {
        var version = ((conf.version) ? conf.version : '0.0.0').split('.');
        if (type === 'major') {
            version[0]++;
            version[1] = 0;
            version[2] = 0;
        } else if (type === 'minor') {
            version[1]++;
            version[2] = 0;
        } else {
            version[2]++;
        }
        conf.version = version.join('.');
        fs.writeFileSync(CONF_FILE, JSON.stringify(conf, null, 4));
        return conf.version;
    }

    function template() {
        _.keys(conf.bob.template).forEach(function (file) {
            // TODO: add file check handling
            var data = fs.readFileSync(file).toString();
            conf.bob.template[file].forEach(function (prop) {
                // TODO: deeper prop handling
                data = data.replace(new RegExp('\\${' + prop + '}', 'g'), conf[prop]);
            });
            fs.writeFileSync(file, data);
        });
    }

    return {
        'versionup': versionup,
        'template': template
    };
}

exports.Charlotte = Charlotte;
