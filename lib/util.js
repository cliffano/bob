var _ = require('underscore'),
  dateformat = require('dateformat');

// apply parameters and functions to data string
// - a parameter has the format ${name}
// - functions are predefined
// TODO: replace this quick hack with a proper template library
function apply(data, params) {
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
      exp = data.match(regex).toString();
    if (exp) {
      arg = exp
        .replace(new RegExp('^\\${' + func + '\\(\'', 'g'), '')
        .replace(new RegExp('\'\\)}$', 'g'), '');
      applied = applied.replace(regex, funcs[func](arg));
    }
  });

  return applied;
}

exports.apply = apply;