var assert = require('assert'),
    sandboxedmodule = require('sandboxed-module'),
    vows = require('vows');

vows.describe('Charlotte').addBatch({
    'versionup': {
        topic: function () {
            return {
                readFileSync: function (file) {
                    assert.equal(file, 'package.json');
                    return '{ "version": "0.0.0" }';
                }
            };
        },
        'versionup should upgrade version build number': function (mockFs) {
            var version, charlotte;
            mockFs.writeFileSync = function (file, data) {
                assert.equal(file, 'package.json');
                version = JSON.parse(data).version;
            };
            charlotte = sandboxedmodule.require('../lib/charlotte', {
                requires: {
                    'fs': mockFs    
                }
            });
            assert.equal((new charlotte.Charlotte()).versionup(), '0.0.1');
            assert.equal(version, '0.0.1');
        },
        'versionup minor should upgrade version minor number': function (mockFs) {
            var version, charlotte;
            mockFs.writeFileSync = function (file, data) {
                assert.equal(file, 'package.json');
                version = JSON.parse(data).version;
            };
            charlotte = sandboxedmodule.require('../lib/charlotte', {
                requires: {
                    'fs': mockFs    
                }
            });
            assert.equal((new charlotte.Charlotte()).versionup('minor'), '0.1.0');
            assert.equal(version, '0.1.0');
        },
        'versionup major should upgrade version major number': function (mockFs) {
            var version, charlotte;
            mockFs.writeFileSync = function (file, data) {
                assert.equal(file, 'package.json');
                version = JSON.parse(data).version;
            };
            charlotte = sandboxedmodule.require('../lib/charlotte', {
                requires: {
                    'fs': mockFs    
                }
            });
            assert.equal((new charlotte.Charlotte()).versionup('major'), '1.0.0');
            assert.equal(version, '1.0.0');
        }
    }
}).exportTo(module);