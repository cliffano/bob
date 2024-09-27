"use strict";
import async from 'async';
import config from './config.js';
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

    this._init(taskNames, (err, settings) => {
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
    async.parallel({ bobTasks: loadTask, appConfig: loadConfig }, cb);
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
    const commands = [];

    taskNames.forEach((taskName) => {

      self._taskTypeNames(taskName, settings).forEach((taskTypeName) => {
        const taskType = bobTasks[taskName].types[taskTypeName];
        Object.keys(taskType).forEach((key) => {
          if (typeof taskType[key] === 'object') {
            taskType[key] = taskType[key][bobMode];
          }
        });
        taskType.preOpts = taskType.preOpts || taskType.opts;
        // strip undefined and null from command elements
        const elems = [taskType.bin, taskType.preOpts, taskType.args, taskType.postOpts].filter(elem => elem);
        commands.push({
          format: util.format(elems.join(' ')),
          meta: {
            task: taskName,
            type: taskTypeName
          }
        });
      });
    });

    const jobs = [];
    commands.forEach((command) => {
      jobs.push((cb) => {
        jazz.compile(command.format).process(TPL_PARAMS, (result) => {
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
