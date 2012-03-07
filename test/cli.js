var assert = require('assert'),
  sandbox = require('sandboxed-module'),
  vows = require('vows');

vows.describe('cli').addBatch({
  'exec': {
    topic: function () {
      return function (mocks, checks) {
        return sandbox.require('../lib/cli', {
          requires: {
            './bob': {
              Bob: function (opts) {
                return {
                  build: function(targets, cb) {
                    checks.targets = targets;
                    cb(null, { status: 'SUCCESS', code: 0 });
                  }
                };
              }
            },
            './charlotte': {
              Charlotte: function () {
                return {
                  versionUp: function (type) {
                    return 'versionup-' + type;
                  },
                  template: function () {
                    checks.templateCallCount = 1;
                  }
                };
              }
            },
            fs: {
              readFileSync: function () {
                
              }
            },
            nomnom: {
              command: function (name) {
                return {
                  callback: function (fn) {
                    fn();
                  }
                };
              },
              parse: function () {
                return {
                  _: 'clean restart'
                };
              },
              parseArgs: function () {
                checks.parseArgsCallCount = 1;
              },
              scriptName: function (name) {
                checks.scriptName = name;
                return {
                  opts: function (opts) {
                    checks.scriptNameOpts = opts;
                  }
                };
              }
            }
          },
          globals: {
            __dirname: '/app/dirname',
            console: {
              log: function (message) {
                checks.messages.push(message);
              }
            },
            process: {
              cwd: function () {
                return '/currdir';
              },
              env: {
                BOB_MODE: 'robot'
              },
              exit: function (code) {
                checks.exitCode = code;
              }
            }
          }
        });
      };
    },
    'when mode is bob': function (topic) {
      var checks = { messages: [] },
        mocks = {};
      new topic(mocks, checks).exec('bob');
      assert.equal(checks.messages.length, 1);
      assert.equal(checks.messages[0], 'SUCCESS | exit code: 0');
      assert.equal(checks.scriptName, 'bob');
      assert.equal(checks.scriptNameOpts.version.help, 'Bob version number');
      assert.isFunction(checks.scriptNameOpts.version.callback);
      assert.equal(checks.scriptNameOpts.version.string, '-v');
      assert.isTrue(checks.scriptNameOpts.version.flag);
      assert.equal(checks.exitCode, 0);
      assert.equal(checks.targets, 'clean restart');
    },
    'when mode is charlotte': function (topic) {
      var checks = { messages: [] },
        mocks = {};
      new topic(mocks, checks).exec('charlotte');
      assert.equal(checks.messages.length, 3);
      assert.equal(checks.messages[0], 'Bump version up to versionup-undefined');
      assert.equal(checks.messages[1], 'Bump version up to versionup-minor');
      assert.equal(checks.messages[2], 'Bump version up to versionup-major');
      assert.equal(checks.scriptName, 'charlotte');
      assert.equal(checks.templateCallCount, 1);
      assert.equal(checks.parseArgsCallCount, 1);
    }
  }
}).exportTo(module);