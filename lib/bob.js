var async = require('async'),
  config = require('./config'),
  deps = require('./deps'),
  jazz = require('jazz'),
  p = require('path'),
  runner = require('./runner'),
  task = require('./task'),
  util = require('util');

function Bob(opts) {
  this.opts = opts;
}

/**
 * Bob is goin' to work!
 * Execute specified tasks 
 *
 * @param {Array} taskNames: an array of task names
 * @param {Function} cb: standard cb(err, result) callback
 */
Bob.prototype.build = function (taskNames, cb) {
  const EXEC_OPTS = {
    cwd: this.opts.appDir,
    quiet: this.opts.quiet
  };
  var self = this;

  this._init(taskNames, function (err, settings) {
    if (err) { cb(err); } else {
      self._commands(settings, function (err, commands) {
        if (err) { cb(err); } else {
          runner.execSeries(commands, EXEC_OPTS, cb);
        }
      });
    }
  });
};

/**
 * Load Bob task files and application config file, and install optional dependencies, all in parallel.
 *
 * @param {Array} taskNames: an array of task names
 * @param {Function} cb: standard cb(err, result) callback
 */
Bob.prototype._init = function (taskNames, cb) {
  var self = this;

  function loadTask(cb) {
    task.load(taskNames, p.join(self.opts.bobDir, 'conf', 'tasks'), cb);
  }
  function loadConfig(cb) {
    config.load(taskNames, self.opts.appDir, cb);
  }
  function installDeps(err, settings) {
    if (err) { cb(err); } else {
      var taskTypeNames = [];
      taskNames.forEach(function (taskName) {
        taskTypeNames = taskTypeNames.concat(self._taskTypeNames(taskName, settings));
      });
      deps.install(taskTypeNames, self.opts.appDir, function () {
        cb(err, settings);
      });
    }
  }
  async.parallel({ bobTasks: loadTask, appConfig: loadConfig }, installDeps);
};

/**
 * Prepare commands to execute.
 *
 * @param {Object} settings: tasks and application configs 
 * @param {Function} cb: standard cb(err, result) callback
 */
Bob.prototype._commands = function (settings, cb) {
  const TPL_PARAMS = {
    bob: this.opts.bobDir
  };
  var bobTasks = settings.bobTasks,
    bobMode = this.opts.bobMode,
    commands = [],
    self = this;

  Object.keys(bobTasks).forEach(function (taskName) {

    self._taskTypeNames(taskName, settings).forEach(function (taskTypeName) {
      var taskType = bobTasks[taskName].types[taskTypeName];
      Object.keys(taskType).forEach(function (key) {
        if (typeof taskType[key] === 'object') {
          taskType[key] = taskType[key][bobMode];
        }
      });
      commands.push({
        format: util.format('%s %s %s', taskType.bin, taskType.opts, taskType.args),
        meta: {
          task: taskName,
          type: taskTypeName
        }
      });
    });
  });

  var jobs = [];
  commands.forEach(function (command) {
    jobs.push(function (cb) {
      jazz.compile(command.format).process(TPL_PARAMS, function (result) {
        command.exec = result;
        delete command.format;
        cb(null, command);
      });
    });
  });
  async.parallel(jobs, cb);
};

Bob.prototype._taskTypeNames = function (taskName, settings) {
  // NOTE: allow multiple types in application config
  var taskTypeNames =
    (settings.appConfig[taskName] && settings.appConfig[taskName].type) ?
    settings.appConfig[taskName].type :
    settings.bobTasks[taskName].default;
  if (!Array.isArray(taskTypeNames)) {
    taskTypeNames = [taskTypeNames];
  }
  return taskTypeNames;
};

module.exports = Bob;