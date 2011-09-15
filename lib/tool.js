function Tool() {

    function val = function (conf, propNamesDsv) {
        var propNames = propNamesDsv.split('.'),
            temp = conf,
            value = undefined;
        propNames.forEach(function (propName) {
            if (temp[propName]) {
                value = temp[propName];
                temp = value;
            } else {
                value = '';
            }
        });
        return value;
    }

    function args = function (conf, args) {
    }

    return {
        args: args,
        val: val
    };
}

exports.Tool = Tool;
