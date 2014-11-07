var buster = require('buster-node'),
  deps = require('../lib/deps'),
  fs = require('fs'),
  proxyquire = require('proxyquire'),
  referee = require('referee'),
  assert = referee.assert;

buster.testCase('testdeps - install', {
  setUp: function () {
    this.mockConsole = this.mock(console);
    this.mockFs = this.mock(fs);
  },
  'should pass error to callback when an error occurs while reading node_modules directory': function (done) {
    this.mockFs.expects('readdir').once().withArgs('somedir/node_modules').callsArgWith(1, new Error('someerror'));
    deps.install([ 'buster', 'kaiju', 'npm' ], { dir: 'somedir' }, function (err) {
      assert.equals(err.message, 'someerror');
      done();
    });
  },
  'should only install uninstalled and non-global modules': function (done) {
    this.mockConsole.expects('log').once().withExactArgs('[deps] Installing modules: %s (might take a while, once-off only)', 'kaiju');
    var mockCanihaz = function (opts) {
      assert.equals(opts.key, 'optDependencies');
      return function (depNames, cb) {
        assert.equals(depNames, 'kaiju');
        cb();
      };
    };
    var deps = proxyquire('../lib/deps', { canihaz: mockCanihaz });
    var installed = ['buster'];
    this.mockFs.expects('readdir').once().withArgs('somedir/node_modules').callsArgWith(1, null, installed);
    deps.install([ 'buster', 'kaiju', 'npm' ], { dir: 'somedir' }, function (err) {
      assert.equals(err, undefined);
      done();
    });    
  },
  'should only install each module once': function (done) {
    this.mockConsole.expects('log').once().withExactArgs('[deps] Installing modules: %s (might take a while, once-off only)', 'kaiju');
    var mockCanihaz = function (opts) {
      assert.equals(opts.key, 'optDependencies');
      return function (depNames, cb) {
        assert.equals(depNames, 'kaiju');
        cb();
      };
    };
    var deps = proxyquire('../lib/deps', { canihaz: mockCanihaz });
    var installed = ['buster'];
    this.mockFs.expects('readdir').once().withArgs('somedir/node_modules').callsArgWith(1, null, installed);
    deps.install([ 'kaiju', 'kaiju', 'kaiju', 'kaiju', 'kaiju' ], { dir: 'somedir' }, function (err) {
      assert.equals(err, undefined);
      done();
    });    
  },
  'should not do anything when all modules are already installed': function (done) {
    var installed = ['buster', 'kaiju'];
    this.mockFs.expects('readdir').once().withArgs('somedir/node_modules').callsArgWith(1, null, installed);
    deps.install([ 'buster', 'kaiju', 'npm' ], { dir: 'somedir' }, function (err) {
      assert.equals(err, undefined);
      done();
    });
  }
});
