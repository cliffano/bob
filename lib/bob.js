"use strict"
import async from 'async';
import config from './config.js';
import deps from './deps.js';
import jazz from 'jazz';
import p from 'path';
import runner from './runner.js';
import task from './task.js';
import util from 'util';

class Bob {

    /**
   * Constructor for initialising Bob.
   *
   * @param {Object} opts: optional
   * - appDir: directory where the userland application calls Bob from
   * - bobDir: directory where Bob's installation is located
   * - appName: name of the userland application (retrieved from its package.json)
   * - appVersion: version value of the userland application (retrieved from its package.json)
   * - bobMode: either `human` or `robot`, when you are a robot - you have to declare yourself :-]
   * - quiet: when true, only display task name and command, but without the command output
   */
  constructor(opts) {
    this.opts = opts;
  }

  /**
   * Bob is goin' to work!
   * Execute specified tasks
   *
   * @param {Array} taskNames: an array of task names
   * @param {Function} cb: standard cb(err, result) callback
   */
  build(taskNames, cb) {
    const EXEC_OPTS = {
      cwd: this.opts.appDir,
      quiet: this.opts.quiet,
      maxBuffer: this.opts.maxBufferInKb * 1024
    };
    const self = this;

    this._init(taskNames, function (err, settings) {
      if (err) { cb(err); } else {
        self._commands(taskNames, settings, (err, commands) => {
          if (err) { cb(err); } else {
            runner.execSeries(commands, EXEC_OPTS, cb);
          }
        });
      }
    });
  }

  /**
   * Load Bob task files and application config file, and install optional dependencies, all in parallel.
   *
   * @param {Array} taskNames: an array of task names
   * @param {Function} cb: standard cb(err, result) callback
   */
  _init(taskNames, cb) {
    const self = this;

    function loadTask(cb) {
      task.load(taskNames, p.join(self.opts.bobDir, 'conf', 'tasks'), cb);
    }
    function loadConfig(cb) {
      config.load(taskNames, self.opts.appDir, cb);
    }
    function installDeps(err, settings) {
      if (err) { cb(err); } else {
        let taskTypeNames = [];
        taskNames.forEach((taskName) => {
          taskTypeNames = taskTypeNames.concat(self._taskTypeNames(taskName, settings));
        });
        deps.install(taskTypeNames, { dir: self.opts.bobDir }, (err) => {
          cb(err, settings);
        });
      }
    }
    async.parallel({ bobTasks: loadTask, appConfig: loadConfig }, installDeps);
  }

  /**
   * Prepare commands to execute.
   *
   * @param {Array} taskNames: an array of task names
   * @param {Object} settings: tasks and application configs
   * @param {Function} cb: standard cb(err, result) callback
   */
  _commands(taskNames, settings, cb) {
    const TPL_PARAMS = {
      app: this.opts.appDir,
      bob: this.opts.bobDir,
      name: this.opts.appName,
      tmp: this.opts.tmpDir,
      version: this.opts.appVersion
    };
    const bobTasks = settings.bobTasks,
      bobMode = this.opts.bobMode,
      self = this;
    let commands = [];

    taskNames.forEach(function (taskName) {

      self._taskTypeNames(taskName, settings).forEach((taskTypeName) => {
        let taskType = bobTasks[taskName].types[taskTypeName];
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

    let jobs = [];
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
  }

  _taskTypeNames(taskName, settings) {
    // NOTE: allow multiple types in application config
    let taskTypeNames =
      (settings.appConfig[taskName] && settings.appConfig[taskName].type) ?
      settings.appConfig[taskName].type :
      settings.bobTasks[taskName].default;
    if (!Array.isArray(taskTypeNames)) {
      taskTypeNames = [taskTypeNames];
    }
    return taskTypeNames;
  }
}

export {
  Bob as default
};