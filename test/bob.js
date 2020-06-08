"use strict"
import Bob from '../lib/bob.js';
import config from '../lib/config.js';
import deps from '../lib/deps.js';
import runner from '../lib/runner.js';
import task from '../lib/task.js';
import sinon from 'sinon';
import referee from '@sinonjs/referee';

describe('testbob - build', function() {

  beforeEach(function () {
    this.mockRunner = sinon.mock(runner);
  });

  afterEach(function () {
    this.mockRunner.verify();
    this.mockRunner.restore();
  });

  it('should construct commands and pass them to series', function (done) {
    this.mockRunner.expects('execSeries').withArgs(['command1', 'command2']).callsArgWith(2, null, 'someresult');
    const bob = new Bob({});
    bob._init = function (taskNames, cb) {
      cb(null, 'somesettings');
    };
    bob._commands = function (taskNames, settings, cb) {
      cb(null, ['command1', 'command2']);
    };
    bob.build(['task1', 'task2' ], function (err, result) {
      referee.assert.isNull(err);
      referee.assert.equals(result, 'someresult');
      done();
    });
  });
  
  it('should pass error to callback when initialisation causes error', function (done) {
    const bob = new Bob({});
    bob._init = function (taskNames, cb) {
      cb(new Error('someerror'));
    };
    bob._commands = function (taskNames, settings, cb) {
      cb(null, ['command1', 'command2']);
    };
    bob.build(['task1', 'task2' ], function (err, result) {
      referee.assert.equals(err.message, 'someerror');
      referee.assert.isUndefined(result);
      done();
    });
  });
  
  it('should pass error to callback when constructing commands causes error', function (done) {
    const bob = new Bob({});
    bob._init = function (taskNames, cb) {
      cb(null, 'somesettings');
    };
    bob._commands = function (taskNames, settings, cb) {
      cb(new Error('someerror'), ['command1', 'command2']);
    };
    bob.build(['task1', 'task2' ], function (err, result) {
      referee.assert.equals(err.message, 'someerror');
      referee.assert.isUndefined(result);
      done();
    });
  });
});

describe('testbob - init', function() {

  beforeEach(function () {
    this.mockConfig = sinon.mock(config);
    this.mockDeps = sinon.mock(deps);
    this.mockTask = sinon.mock(task);
  });

  afterEach(function () {
    this.mockConfig.verify();
    this.mockConfig.restore();
    this.mockDeps.verify();
    this.mockDeps.restore();
    this.mockTask.verify();
    this.mockTask.restore();
  });

  it('should load task, load config, and install dependencies', function (done) {
    const mockAppConfig = {
      task1: { type: 'type1'},
      task2: { type: 'type2'}
    };
    const mockBobTasks = {
      task1: { default: 'type1' },
      task2: { default: 'type2' }
    };
    this.mockTask.expects('load').once().withArgs(['task1', 'task2'], '/somebobdir/conf/tasks').callsArgWith(2, null, mockBobTasks);
    this.mockConfig.expects('load').once().withArgs(['task1', 'task2'], '/someappdir').callsArgWith(2, null, mockAppConfig);
    this.mockDeps.expects('install').once().withArgs(['type1', 'type2'], { dir: '/somebobdir' }).callsArgWith(2);
    const bob = new Bob({ bobDir: '/somebobdir', appDir: '/someappdir' });
    bob._init(['task1', 'task2'], done);
  });

  it('should pass error to callback when dependencies installation causes an error', function (done) {
    const mockAppConfig = {
      task1: { type: 'type1'},
      task2: { type: 'type2'}
    };
    const mockBobTasks = {
      task1: { default: 'type1' },
      task2: { default: 'type2' }
    };
    this.mockTask.expects('load').once().withArgs(['task1', 'task2'], '/somebobdir/conf/tasks').callsArgWith(2, null, mockBobTasks);
    this.mockConfig.expects('load').once().withArgs(['task1', 'task2'], '/someappdir').callsArgWith(2, null, mockAppConfig);
    this.mockDeps.expects('install').once().withArgs(['type1', 'type2'], { dir: '/somebobdir' }).callsArgWith(2, new Error('someerror'));
    const bob = new Bob({ bobDir: '/somebobdir', appDir: '/someappdir' });
    bob._init(['task1', 'task2'], function (err) {
      referee.assert.equals(err.message, 'someerror');
      done();
    });
  });

  it('should pass error to callback when task loading causes an error', function (done) {
    this.mockTask.expects('load').once().withArgs(['task1', 'task2'], '/somebobdir/conf/tasks').callsArgWith(2, new Error('someerror'));
    const bob = new Bob({ bobDir: '/somebobdir', appDir: '/someappdir' });
    bob._init(['task1', 'task2'], function (err) {
      referee.assert.equals(err.message, 'someerror');
      done();
    });
  });
});

describe('testbob - commands', function () {

  it('should construct commands and pass them to callback', function () {
    const bob = new Bob({ bobMode: 'robot' });
    const taskNames = [ 'lint' ];
    const settings = {
      appConfig: { lint: { type: 'jshint' } },
      bobTasks: { lint: { default: 'jshint', types: { jshint: { bin: '{bob}/node_modules/jshint/bin/jshint', opts: { human: '', robot: '--jslint-reporter' }, args: 'lib/ test/'} } } }
    };
    bob._commands(taskNames, settings, function (err, results) {
      referee.assert.equals(err, null);
      referee.assert.equals(results[0].exec, '/node_modules/jshint/bin/jshint --jslint-reporter lib/ test/');
      referee.assert.equals(results[0].meta.task, 'lint');
      referee.assert.equals(results[0].meta.type, 'jshint');
    });
  });
});

describe('testbob - taskTypeNames', function () {

  it('should get task type from app config when available', function () {
    const settings = {
      appConfig: {
        task1: { type: ['type1'] }
      }
    };
    const bob = new Bob({});
    const taskTypeNames = bob._taskTypeNames('task1', settings);
    referee.assert.equals(taskTypeNames, ['type1']);
  });

  it('should get task type from bob tasks when app config is not available', function () {
    const settings = {
      appConfig: {},
      bobTasks: {
        task1: { default: 'type1' }
      }
    };
    const bob = new Bob({});
    const taskTypeNames = bob._taskTypeNames('task1', settings);
    referee.assert.equals(taskTypeNames, ['type1']);
  });
});
