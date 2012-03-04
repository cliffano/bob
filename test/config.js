var assert = require('assert'),
  sandbox = require('sandboxed-module'),
  vows = require('vows');

vows.describe('config').addBatch({
  'config': {
    topic: function () {
      return function(mocks) {
        return sandbox.require('../lib/config', {
          requires: {
            fs: {
              statSync: function () {
                return {
                  isFile: function () {
                    return true;
                  }
                };
              },
              readFileSync: mocks.readFileSync
            },
            './packagejson': {
              PackageJson: mocks.PackageJson
            }
          }
        });
      };
    },
    'when fields are unique, then they should not overwrite each other': function (topic) {
      var conf = new topic({
        readFileSync: function (file) {
          if (file === '/app/myapp/.bob.json') {
            return '{ "foo": "from.bob.json" }';
          } else if (file === '/app/bob/conf/mode/robot.json') {
            return '{ "abc": "frommode.json" }';
          }
        },
        PackageJson: function (file) {
          return {
            read: function () {
              return { xyz: 'frompackage.json' };
            }
          };
        }
      }).Config({
        appDir: '/app/myapp',
        bobDir: '/app/bob',
        mode: 'robot'
      }).read();
      assert.equal(conf.xyz, 'frompackage.json');
      assert.equal(conf.abc, 'frommode.json');
      assert.equal(conf.bob.foo, 'from.bob.json');
    },
    'when field is the same, then .bob.json should overwrite mode json': function (topic) {
      var conf = new topic({
        readFileSync: function (file) {
          if (file === '/app/myapp/.bob.json') {
            return '{ "foo": "from.bob.json" }';
          } else if (file === '/app/bob/conf/mode/robot.json') {
            return '{ "bob": { "foo": "frommode.json" }}';
          }
        },
        PackageJson: function (file) {
          return {
            read: function () {
              return {};
            }
          };
        }
      }).Config({
        appDir: '/app/myapp',
        bobDir: '/app/bob',
        mode: 'robot'
      }).read();
      assert.equal(conf.bob.foo, 'from.bob.json');
    },
    'when field is the same, then .bob.json should overwrite package.json': function (topic) {
      var conf = new topic({
        readFileSync: function (file) {
          if (file === '/app/myapp/.bob.json') {
            return '{ "foo": "from.bob.json" }';
          } else if (file === '/app/bob/conf/mode/robot.json') {
            return '{}}';
          }
        },
        PackageJson: function (file) {
          return {
            read: function () {
              return { foo: 'frompackage.json' };
            }
          };
        }
      }).Config({
        appDir: '/app/myapp',
        bobDir: '/app/bob',
        mode: 'robot'
      }).read();
      assert.equal(conf.bob.foo, 'from.bob.json');
    },
    'when field is the same, then mode json should overwrite package.json': function (topic) {
      var conf = new topic({
        readFileSync: function (file) {
          if (file === '/app/myapp/.bob.json') {
            return undefined;
          } else if (file === '/app/bob/conf/mode/robot.json') {
            return '{ "bob": { "foo": "frommode.json" }}';
          }
        },
        PackageJson: function (file) {
          return {
            read: function () {
              return { bob: { foo: 'frompackage.json' }};
            }
          };
        }
      }).Config({
        appDir: '/app/myapp',
        bobDir: '/app/bob',
        mode: 'robot'
      }).read();
      assert.equal(conf.bob.foo, 'frommode.json');
    },
    'when .bob.json reading throws an error, it should be ignored': function (topic) {
      var conf = new topic({
        readFileSync: function (file) {
          if (file === '/app/myapp/.bob.json') {
            throw new Error('.bob.json does not exist');
          } else if (file === '/app/bob/conf/mode/robot.json') {
            return '{ "bob": { "foo": "frommode.json" }}';
          }
        },
        PackageJson: function (file) {
          return {
            read: function () {
              return { xyz: 'frompackage.json' };
            }
          };
        }
      }).Config({
        appDir: '/app/myapp',
        bobDir: '/app/bob',
        mode: 'robot'
      }).read();
      assert.equal(conf.xyz, 'frompackage.json');
      assert.equal(conf.bob.foo, 'frommode.json');
    }
  }
}).exportTo(module);