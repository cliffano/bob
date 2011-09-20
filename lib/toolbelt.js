function Toolbelt() {

    function val(conf, propNamesDsv, defaultVal) {
        var propNames = (propNamesDsv) ? propNamesDsv.split('.') : [],
            temp = conf,
            value = undefined;
        propNames.forEach(function (propName) {
            if (temp[propName]) {
                value = temp[propName];
                temp = value;
            } else {
                value = (defaultVal) ? defaultVal : undefined;
            }
        });
        return value;
    }

    function args(conf, params) {
        var args = [];
        if (params && params.join) {
            params.forEach(function (param) {
                args.push(param.name + '="' + (val(conf, param.name.toLowerCase().replace(/_/g, '.'), param.defaultVal) || '') + '"');
            });
        }
        return args.join(' ');
    }

    // TODO: deep merge
    function merge(objs) {
        var o = {};
        objs.forEach(function (obj) {
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) {
                    o[attr] = obj[attr];
                }
            }            
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
