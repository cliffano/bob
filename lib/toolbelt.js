// TOREFACTOR
var _ = require('underscore'),
    dateformat = require('dateformat'),
    jquery = require('jquery');

function Toolbelt() {

    function val(conf, propNamesDsv, defaultVal) {
        var OVERRIDE_PROPS = ["name", "version"],
            propNames = (propNamesDsv) ? propNamesDsv.split('.') : [],
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
        if (value && _.isString(value)) {
            OVERRIDE_PROPS.forEach(function (prop) {
                value = value.replace(new RegExp('\\${' + prop + '}', 'g'), conf[prop]); 
            });
        }
        return value;
    }

    function args(conf, params) {
        var argx = [];
        if (params && params.join) {
            params.forEach(function (param) {
                argx.push(param.name + '=' +
                    (val(conf,
                        param.name.toLowerCase().replace(/_/g, '.'),
                        param.defaultVal) || ''));
            });
        }
        return argx;
    }

    // combine all fields on an array of objects into a single object
    function merge(objs) {
        var o = {};
        objs.forEach(function (obj) {
            o = jquery.extend(true, o, obj);
        });
        return o;
    }

    // primitive function support on a string data
    function applyFn(data) {
        var FUNCTIONS = {
                'now': function (format) {
                    return dateformat(new Date(), format);
                }
            };
        _.keys(FUNCTIONS).forEach(function (func) {
            var regex = new RegExp('\\${' + func + '.*}', 'g'),
                exp = data.match(regex).toString();
            if (exp) {
                arg = exp
                    .replace(new RegExp('\\${' + func + '\\(\'', 'g'), '')
                    .replace(new RegExp('\'\\)}', 'g'), '');
                data = data.replace(regex, FUNCTIONS[func](arg));
            }
        });
        return data;
    }

    return {
        args: args,
        merge: merge,
        val: val,
        applyFn: applyFn
    };
}

exports.Toolbelt = Toolbelt;
