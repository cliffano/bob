var assert = require('assert'),
  jscoverageHack = require('../lib/bob'),
  sandbox = require('sandboxed-module'),
  vows = require('vows');

vows.describe('bob').addBatch({
  'build': {
    topic: function () {
      return function (mocks, checks) {
        return sandbox.require('../lib/bob', {
          requires: {
            './config': {
              Config: function (opts) {
                return {
                  read: function () {
                    return mocks.config;
                  }
                };
              }
            },
            './make': {
              Make: function (opts) {
                return {
                  exec: function(params, targets, cb) {
                    checks.makeParams = params;
                    checks.makeTargets = targets;
                    cb(null, checks);
                  }
                };
              }
            },
            fs: {
              readFileSync: function (file) {
                checks.makeJsonFile = file;
                return JSON.stringify(mocks.makeJson);
              }
            }
          }
        });
      };
    },
    'when params and targets are provided': {
      topic: function (topic) {
        var checks = {},
          mocks = {
            config: {
              scripts: {
                restart: 'node app-restart'
              }
            },
            makeJson: {
              "params": {
                "BOB_STYLE_FILES": {
                  "default": "lib/"
                },
                "BOB_STYLE_OPTS": {
                }
              },
              "targets": {
                "restart": {
                  "override": {
                    "prop": "scripts.restart",
                    "target": "restart-npm"
                  }
                }
              }
            }
          },
          opts = {
            bobDir: '/app/bob'
          };
        new topic(mocks, checks).Bob(opts).build(['clean', 'restart'], this.callback);
      },
      'then targets should contain build arguments': function (err, result) {
        assert.isNull(err);
        assert.equal(result.makeTargets.length, 2);
        assert.equal(result.makeTargets[0], 'clean');
      },
      'and target should be replaced when override property exists in config': function (err, result) {
        assert.equal(result.makeTargets[1], 'restart-npm');
      },
      'and Bob directory should be added to Makefile': function (err, result) {
        assert.equal(result.makeJsonFile, '/app/bob/conf/make.json');
      },
      'and NODE_ENV default param should be set to development': function (err, result) {
        assert.equal(result.makeParams.NODE_ENV, 'development');
      },
      'and Makefile parameters should contain configuration in make.json': function (err, result) {
        assert.equal(result.makeParams.BOB_DIR, '/app/bob');
        assert.equal(result.makeParams.BOB_STYLE_FILES, 'lib/');
      }
    }
  }
}).exportTo(module);