var Bob = require('../lib/bob'),
  buster = require('buster-node'),
  config = require('../lib/config'),
  deps = require('../lib/deps'),
  referee = require('referee'),
  runner = require('../lib/runner'),
  task = require('../lib/task'),
  assert = referee.assert;

buster.testCase('testbob - build', {
  setUp: function () {
    this.mockRunner = this.mock(runner);
  },
  'should construct commands and pass them to series': function (done) {
    this.mockRunner.expects('execSeries').withArgs(['command1', 'command2']).callsArgWith(2, null, 'someresult');
    var bob = new Bob({});
    bob._init = function (taskNames, cb) {
      cb(null, 'somesettings');
    };
    bob._commands = function (taskNames, settings, cb) {
      cb(null, ['command1', 'command2']);
    };
    bob.build(['task1', 'task2' ], function (err, result) {
      assert.isNull(err);
      assert.equals(result, 'someresult');
      done();
    });
  },
  'should pass error to callback when initialisation causes error': function (done) {
    var bob = new Bob({});
    bob._init = function (taskNames, cb) {
      cb(new Error('someerror'));
    };
    bob._commands = function (taskNames, settings, cb) {
      cb(null, ['command1', 'command2']);
    };
    bob.build(['task1', 'task2' ], function (err, result) {
      assert.equals(err.message, 'someerror');
      assert.equals(result, undefined);
      done();
    });
  },
  'should pass error to callback when constructing commands causes error': function (done) {
    var bob = new Bob({});
    bob._init = function (taskNames, cb) {
      cb(null, 'somesettings');
    };
    bob._commands = function (taskNames, settings, cb) {
      cb(new Error('someerror'), ['command1', 'command2']);
    };
    bob.build(['task1', 'task2' ], function (err, result) {
      assert.equals(err.message, 'someerror');
      assert.equals(result, undefined);
      done();
    });
  }
});

buster.testCase('testbob - init', {
  setUp: function () {
    this.mockConfig = this.mock(config);
    this.mockDeps = this.mock(deps);
    this.mockTask = this.mock(task);
  },
  'should load task, load config, and install dependencies': function (done) {
    var mockAppConfig = {
      task1: { type: 'type1'},
      task2: { type: 'type2'}
    };
    var mockBobTasks = {
      task1: { default: 'type1' },
      task2: { default: 'type2' }
    };
    this.mockTask.expects('load').once().withArgs(['task1', 'task2'], '/somebobdir/conf/tasks').callsArgWith(2, null, mockBobTasks);
    this.mockConfig.expects('load').once().withArgs(['task1', 'task2'], '/someappdir').callsArgWith(2, null, mockAppConfig);
    this.mockDeps.expects('install').once().withArgs(['type1', 'type2'], { dir: '/somebobdir' }).callsArgWith(2);
    var bob = new Bob({ bobDir: '/somebobdir', appDir: '/someappdir' });
    bob._init(['task1', 'task2'], done);
  },
  'should pass error to callback when dependencies installation causes an error': function (done) {
    var mockAppConfig = {
      task1: { type: 'type1'},
      task2: { type: 'type2'}
    };
    var mockBobTasks = {
      task1: { default: 'type1' },
      task2: { default: 'type2' }
    };
    this.mockTask.expects('load').once().withArgs(['task1', 'task2'], '/somebobdir/conf/tasks').callsArgWith(2, null, mockBobTasks);
    this.mockConfig.expects('load').once().withArgs(['task1', 'task2'], '/someappdir').callsArgWith(2, null, mockAppConfig);
    this.mockDeps.expects('install').once().withArgs(['type1', 'type2'], { dir: '/somebobdir' }).callsArgWith(2, new Error('someerror'));
    var bob = new Bob({ bobDir: '/somebobdir', appDir: '/someappdir' });
    bob._init(['task1', 'task2'], function (err) {
      assert.equals(err.message, 'someerror');
      done();
    });
  },
  'should pass error to callback when task loading causes an error': function (done) {
    var mockAppConfig = {
      task1: { type: 'type1'},
      task2: { type: 'type2'}
    };
    var mockBobTasks = {
      task1: { default: 'type1' },
      task2: { default: 'type2' }
    };
    this.mockTask.expects('load').once().withArgs(['task1', 'task2'], '/somebobdir/conf/tasks').callsArgWith(2, new Error('someerror'));
    var bob = new Bob({ bobDir: '/somebobdir', appDir: '/someappdir' });
    bob._init(['task1', 'task2'], function (err) {
      assert.equals(err.message, 'someerror');
      done();
    });
  }
});

buster.testCase('testbob - commands', {
  setUp: function () {
    this.mock({});
  },
  'should construct commands and pass them to callback': function () {
    var bob = new Bob({ bobMode: 'robot' });
    var taskNames = [ 'lint' ];
    var settings = {
      appConfig: { lint: { type: 'jshint' } },
      bobTasks: { lint: { default: 'jshint', types: { jshint: { bin: '{bob}/node_modules/jshint/bin/jshint', opts: { human: '', robot: '--jslint-reporter' }, args: 'lib/ test/'} } } }
    };
    bob._commands(taskNames, settings, function (err, results) {
      assert.equals(err, null);
      assert.equals(results[0].exec, '/node_modules/jshint/bin/jshint --jslint-reporter lib/ test/');
      assert.equals(results[0].meta.task, 'lint');
      assert.equals(results[0].meta.type, 'jshint');
    });
  }
});

buster.testCase('testbob - taskTypeNames', {
  setUp: function () {
    this.mock({});
  },
  'should get task type from app config when available': function () {
    var settings = {
      appConfig: {
        task1: { type: ['type1'] }
      }
    };
    var bob = new Bob({});
    var taskTypeNames = bob._taskTypeNames('task1', settings);
    assert.equals(taskTypeNames, ['type1']);
  },
  'should get task type from bob tasks when app config is not available': function () {
    var settings = {
      appConfig: {},
      bobTasks: {
        task1: { default: 'type1' }
      }
    };
    var bob = new Bob({});
    var taskTypeNames = bob._taskTypeNames('task1', settings);
    assert.equals(taskTypeNames, ['type1']);
  }
});
