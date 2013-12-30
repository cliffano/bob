var async = require('async'),
  child = require('child_process'),
  colors = require('colors'),
  fs = require('fs'),
  mkdirp = require('mkdirp'),
  p = require('path');

/**
 * Execute a single command.
 *
 * @param {String} command: the command to execute
 * @param {Object} opts:
 *   - cwd: base directory where the commands should be executed from
 *   - quiet: don't display command output if quiet
 *   - task: Bob task name, used to create output directory
 *   - type: Bob task type name, used to create output directory
 *   - dir: report directory where process output will be written into a file
 * @param {Function} cb: standard cb(err, result) callback
 */
function exec(command, opts, cb) {

  console.log('%s | %s', opts.task.cyan, command);

  var cproc = child.exec(command, opts, cb),
    wstream = fs.createWriteStream(p.join(opts.dir, opts.type + '.out'));

  cproc.stdout.on('data', function (data) {
    if (!opts.quiet) {
      process.stdout.write(data);
    }
    wstream.write(data);
  });

  cproc.stderr.on('data', function (data) {
    if (!opts.quiet) {
      process.stderr.write(data);
    }
    wstream.write(data);
  });
}

/**
 * Execute multiple commands in series.
 *
 * @param {Array} commands: an array of commands, each command contains:
 *   - exec: executable command line, to be executed on shell
 *   - meta: command metadata, task and type
 * @param {Object} opts:
 *   - cwd: base directory where the commands should be executed from
 *   - quiet: don't display command output if quiet
 * @param {Function} cb: standard cb(err, result) callback
 */
function execSeries(commands, opts, cb) {
  mkdirp = opts.mkdirp || mkdirp;

  function _exec(command, cb) {
    var dir = p.join(opts.cwd, '.bob', command.meta.task);
    mkdirp(dir, function (err) {
      if (err) { cb(err); } else {
        opts.task = command.meta.task;
        opts.type = command.meta.type;
        opts.dir = dir;
        exec(command.exec, opts, cb);
      }
    });
  }
  async.eachSeries(commands, _exec, cb);
}

exports.exec = exec;
exports.execSeries = execSeries;