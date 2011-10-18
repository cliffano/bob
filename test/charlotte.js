var assert = require('assert'),
    sandboxedmodule = require('sandboxed-module'),
    vows = require('vows');

function getVersxionUpCharlotte(origVersion, newVersion) {
    var mockFs = {
            readFileSync: function (file) {
                assert.equal(file, 'package.json');
                return (origVersion === undefined) ? '{}' : '{ "version": "' + origVersion + '" }';
            },
            writeFileSync: function (file, data) {
                assert.equal(file, 'package.json');
                assert.equal(JSON.parse(data).version, newVersion);
            }
        };
    return sandboxedmodule.require('../lib/charlotte', {
        requires: {
            'fs': mockFs    
        }
    });
}

vows.describe('Charlotte').addBatch({
    'versionup': {
        topic: function getVersionUpCharlotte(origVersion, newVersion) {
            var mockFs = {
                    readFileSync: function (file) {
                        assert.equal(file, 'package.json');
                        return (origVersion === undefined) ? '{}' : '{ "version": "' + origVersion + '" }';
                    },
                    writeFileSync: function (file, data) {
                        assert.equal(file, 'package.json');
                        assert.equal(JSON.parse(data).version, newVersion);
                    }
                };
            return sandboxedmodule.require('../lib/charlotte', {
                requires: {
                    'fs': mockFs    
                }
            });
        },
        'versionup should upgrade version build number': function (getVersionUpCharlotte) {
            var charlotte = getVersionUpCharlotte('0.0.0', '0.0.1');
            assert.equal((new charlotte.Charlotte()).versionup(), '0.0.1');
        },
        'versionup minor should upgrade version minor number': function (getVersionUpCharlotte) {
            var charlotte = getVersionUpCharlotte('0.0.0', '0.1.0');
            assert.equal((new charlotte.Charlotte()).versionup('minor'), '0.1.0');
        },
        'versionup major should upgrade version major number': function (getVersionUpCharlotte) {
            var charlotte = getVersionUpCharlotte('0.0.0', '1.0.0');
            assert.equal((new charlotte.Charlotte()).versionup('major'), '1.0.0');
        },
        'versionup should set version to 0.0.1 when original version is undefined': function (getVersionUpCharlotte) {
            var charlotte = getVersionUpCharlotte(undefined, '0.0.1');
            assert.equal((new charlotte.Charlotte()).versionup(), '0.0.1');
        },
    }
}).exportTo(module);