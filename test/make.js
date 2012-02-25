var assert = require('assert'),
  sandbox = require('sandboxed-module'),
  vows = require('vows');

vows.describe('make').addBatch({
  'make': {
    topic: function () {
      return function (exitCode) {
        console.log(">>" + exitCode)
        return sandbox.require('../lib/make', {
          requires: {
            child_process: {
              spawn: function (command, args) {
                assert.equal(command, 'make');
                return {
                  stdout: {
                    on: function (event, cb) {
                      if (event === 'data') {
                        cb('stdout data');
                      }
                    }
                  },
                  stderr: {
                    on: function (event, cb) {
                      if (event === 'data') {
                        cb('stderr data');
                      }
                    }
                  },
                  on: function (event, cb) {
                    if (event === 'exit') {
                      cb(exitCode);
                    }
                  }
                };
              }
            }
          },
          globals: {
            process: {
              stdout: {
                write: function (data) {
                  assert.equal(data, 'stdout data');
                }
              },
              stderr: {
                write: function (data) {
                  assert.equal(data, 'stderr data');
                }
              }           
            }
          }
        });
      };
    },
    'exec with exit code zero': {
      topic: function (topic) {
        new topic(0).Make({ bobDir: '/dev/bob' }).exec({ key1: 'val1', key2: 'val2' }, [ 'target1', 'target2' ], this.callback);
      },
      'then result should contain success status and zero exit code': function (err, result) {
        assert.isNull(err);
        assert.equal(result.status, 'SUCCESS');
        assert.equal(result.code, 0);
      }
    },
    'exec with exit code non zero': {
      topic: function (topic) {
        new topic(1).Make({ bobDir: '/dev/bob' }).exec({ key1: 'val1', key2: 'val2' }, [ 'target1', 'target2' ], this.callback);
      },
      'then result should contain failure status and original exit code': function (err, result) {
        assert.isNull(err);
        assert.equal(result.status, 'FAILURE');
        assert.equal(result.code, 1);
      }
    }
  }
}).exportTo(module);