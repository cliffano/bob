var _ = require('underscore');

function Toolbelt() {

    function val(conf, propNamesDsv, defaultVal) {
        var propNames = (propNamesDsv) ? propNamesDsv.split('.') : [],
            temp = conf,
            value;
        propNames.forEach(function (propName) {
            if (temp[propName]) {
                value = temp[propName];
                temp = value;
            } else {
                value = defaultVal || undefined;
            }
        });
        return value;
    }

    function args(conf, params) {
        var argx = [];
        if (params && params.join) {
            params.forEach(function (param) {
                argx.push(param.name + '='
                    + (val(conf,
                        param.name.toLowerCase().replace(/_/g, '.'),
                        param.defaultVal) || ''));
            });
        }
        return argx;
    }

    // TODO: deep merge
    function merge(objs) {
        var o = {};
        objs.forEach(function (obj) {
            o = _.extend(o, obj);
        });
        return o;
    }

    return {
        args: args,
        merge: merge,
        val: val
    };
}

exports.Toolbelt = Toolbelt;
