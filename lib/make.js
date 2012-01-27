var _ = require('underscore'),
  childProcess = require('child_process'),
  p = require('path');

// just a tiny wrapper to 'make'
function Make(opts) {
  
  function exec(params, targets, cb) {

    // format { key1: val1, key2: val2 } params into key1=val1 key2=val2
    var args = [];
    _.keys(params).forEach(function (param) {
      args.push(param + '=' + params[param]);
    });

    // spawn make process
    var spawn = childProcess.spawn('make',
      ['-f', p.join(opts.bobDir, 'conf/Makefile')].
      concat(args, targets));
    spawn.stdout.on('data', function (data) {
      process.stdout.write(data);
    });
    spawn.stderr.on('data', function (data) {
      process.stderr.write(data);
    });
    spawn.on('exit', function (code) {
      cb(null, {
        status: (code === 0) ? 'SUCCESS' : 'FAILURE',
        code: code
      });
    });
  }

  return {
    exec: exec
  }
}

exports.Make = Make;