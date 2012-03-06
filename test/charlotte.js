var assert = require('assert'),
  sandbox = require('sandboxed-module'),
  vows = require('vows');

vows.describe('charlotte').addBatch({
  'charlotte': {
    topic: function () {
      return function (mocks, checks) {
        return sandbox.require('../lib/charlotte', {
          requires: {
            './config': {
              Config: function(opts) {
                return {
                  read: function() {
                    return {
                      bob: {
                        template: [ 'abc.txt', 'def.xml' ]
                      },
                      foo: 'bar',
                      hello: 'world'
                    };
                  }
                };
              }
            },
            fs: {
              readFileSync: function (file) {
                return mocks.files[file];
              },
              writeFileSync: function (file, data) {
                checks.files[file] = data;
              }
            },
            './packagejson': {
              PackageJson: function(file) {
                assert.equal(file, checks.packageJsonFile);
                return {
                  versionUp: function (type) {
                    assert.equal(type, checks.type);
                    return '1.2.3';
                  }
                };
              }
            }
          }
        });
      };
    },
    'template should update template files': function (topic) {
      var checks = { packageJsonFile: 'package.json', files: {} };
      new topic(
        { files: { 'abc.txt': 'content of abc.txt ${foo}', 'def.xml': '${hello} content of def.xml' } },
        checks).Charlotte({}).template();
      assert.equal(checks.files['abc.txt'], 'content of abc.txt bar');
      assert.equal(checks.files['def.xml'], 'world content of def.xml');
    },
    'versionUp should delegate to PackageJson versionUp': function (topic) {
      var version = new topic({}, { packageJsonFile: 'package.json', type: 'minor' }).Charlotte({}).versionUp('minor');
      assert.equal(version, '1.2.3');
    }
  }
}).exportTo(module);