var _ = require('underscore'),
    fs = require('fs'),
    Toolbelt = require('./toolbelt').Toolbelt,
    toolbelt = new Toolbelt();

// Charlotte takes care of stuffs that can't be done easily from shell
function Charlotte() {

    var CONF_FILE = 'package.json',
        conf = JSON.parse(fs.readFileSync(CONF_FILE));

    // bump major/minor/build number in package.json's version field
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
        fs.writeFileSync(CONF_FILE, JSON.stringify(conf, null, 2));
        return conf.version;
    }

    // process variables in template files
    function template() {
        _.keys(conf.bob.template).forEach(function (file) {
            // TODO: add file check handling
            var data = fs.readFileSync(file).toString();
            conf.bob.template[file].forEach(function (prop) {
                data = toolbelt.applyFn(data);
                // TODO: deeper prop handling
                data = data.replace(new RegExp('\\${' + prop + '}', 'g'), conf[prop]);
            });
            fs.writeFileSync(file, data);
        });
    }

    return {
        versionup: versionup,
        template: template
    };
}

exports.Charlotte = Charlotte;
