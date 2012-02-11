var assert = require('assert'),
  sandbox = require('sandboxed-module'),
  packageJson = require('../lib/packagejson'),
  vows = require('vows');

vows.describe('packagejson').addBatch({
  'packgejson': {
    topic: function () {
      return sandbox.require('../lib/packagejson', {
        requires: {
          fs: {
            readFileSync: function (file) {
              assert.equal(file, 'package.json');
              return '{ "name": "foo", "version": "1.2.3" }';
            },
            writeFileSync: function (file, data) {
              assert.equal(file, 'package.json');
            }
          }
        }
      });
    },
    'read': {
      'when file exists then file content should be returned as an object': function (topic) {
        var pkg = new topic.PackageJson('package.json').read();
        assert.equal(pkg.name, 'foo');
        assert.equal(pkg.version, '1.2.3');
      }
    },
    'write': {
      'when file exists then package object should be written to file': function (topic) {
        var pkg = { name: 'foo', version: '1.2.3' };
        new topic.PackageJson('package.json').write(pkg);
      }
    },
    'versionUp': {
      'when type is ommitted then patch number should be incremented': function (topic) {
        var version = new topic.PackageJson('package.json').versionUp();
        assert.equal(version, '1.2.4');
      },
      'when type is unknown then patch number should be incremented': function (topic) {
        var version = new topic.PackageJson('package.json').versionUp('blah');
        assert.equal(version, '1.2.4');
      },
      'when type is minor then minor number should be incremented and patch number set to 0': function (topic) {
        var version = new topic.PackageJson('package.json').versionUp('minor');
        assert.equal(version, '1.3.0');
      },
      'when type is major then major number should be incremented, minor and patch numbers set to 0': function (topic) {
        var version = new topic.PackageJson('package.json').versionUp('major');
        assert.equal(version, '2.0.0');
      }
    }
  }
}).exportTo(module);