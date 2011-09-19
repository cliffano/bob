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

    return {
        args: args,
        val: val
    };
}

exports.Toolbelt = Toolbelt;
