var _ = require('underscore'),
  dateformat = require('dateformat');

// apply parameters and functions to data string
// - a parameter has the format ${name}
// - functions are predefined
// TODO: replace this quick hack with a proper template library
function apply(data, params) {

  if (typeof data !== 'string' || _.isEmpty(params)) {
    return data;
  }

  var applied = data;

  // apply parameters
  // TODO: deeper level prop name handling
  _.keys(params).forEach(function (param) {
    applied = applied.replace(new RegExp('\\${' + param + '}', 'g'), params[param]);
  });

  // apply functions
  // TODO: multi calls of the same function with diff arguments
  var funcs = {
    now: function (format) {
      return dateformat(new Date(), format);
    }
  };
  _.keys(funcs).forEach(function (func) {
    var regex = new RegExp('\\${' + func + '.*}', 'g'),
      exp = data.match(regex);
    if (exp) {
      arg = exp.toString()
        .replace(new RegExp('^\\${' + func + '\\(\'', 'g'), '')
        .replace(new RegExp('\'\\)}$', 'g'), '');
      applied = applied.replace(regex, funcs[func](arg));
    }
  });

  return applied;
}

// retrieve dsv (dot separated value) property from an object
function val(dsv, obj) {
  var value;

  if (dsv && obj) {
    var props = dsv.split('.');
    for (var i = 0, ln = props.length; i < ln; i += 1) {
      value = (value) ? value[props[i]] : obj[props[i]];
      if (value === undefined) {
        break;
      }
    }
  }

  return value;
}

exports.apply = apply;
exports.val = val;