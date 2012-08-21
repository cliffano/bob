var _ = require('underscore'),
  bag = require('bagofholding');

/**
 * class Make
 *
 * @param {String} file: Makefile path
 * @param {Boolean} verbose: if true, then target shell commands and make arguments will be displayed
 */
function Make(file, verbose) {
  this.file = file;
  this.verbose = verbose || false;
}

/**
 * Execute make with specified opts/params and targets.
 *
 * @param {Object} params: make opts/params, { key: value } format will be converted to key=value make argument
 * @param {Array} targets: make targets
 * @param {Object} cb: standard cb(err, result) callback
 */
Make.prototype.exec = function (params, targets, cb) {

  var opts = _.reduce(_.keys(params),
      function (memo, param) {
        memo.push(param + '=' + params[param]);
        return memo;
      }, []),
    args = ['--file', this.file];

  if (!this.verbose) {
    args.push('--silent');
  }

  args = args.concat(opts).concat(targets);
  
  if (this.verbose) {
    console.log('Make arguments:\n\t%s', args.join('\n\t'));
  }

  bag.cli.spawn('make', args, cb);
}

module.exports = Make;