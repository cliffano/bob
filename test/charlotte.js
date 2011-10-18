var assert = require('assert'),
    sandboxedmodule = require('sandboxed-module'),
    vows = require('vows');

function getVersionUpCharlotte(origVersion, newVersion) {
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

function getTemplateCharlotte(confData, fileData, mergedFileData) {
    var mockFs = {
            readFileSync: function (file) {
                if (file === 'package.json') {
                    return confData;
                } else {
                    assert.equal(file, 'foo.txt');
                    return fileData;
                }
            },
            writeFileSync: function (file, data) {
                assert.equal(file, 'foo.txt');
                assert.equal(data, mergedFileData);
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
        'should upgrade version build number': function () {
            var charlotte = getVersionUpCharlotte('8.8.8', '8.8.9');
            assert.equal((new charlotte.Charlotte()).versionup(), '8.8.9');
        },
        'minor should upgrade version minor number': function () {
            var charlotte = getVersionUpCharlotte('8.8.8', '8.9.8');
            assert.equal((new charlotte.Charlotte()).versionup('minor'), '8.9.8');
        },
        'major should upgrade version major number': function () {
            var charlotte = getVersionUpCharlotte('8.8.8', '9.8.8');
            assert.equal((new charlotte.Charlotte()).versionup('major'), '9.8.8');
        },
        'should set version to 0.0.1 when original version is undefined': function () {
            var charlotte = getVersionUpCharlotte(undefined, '0.0.1');
            assert.equal((new charlotte.Charlotte()).versionup(), '0.0.1');
        }
    },
    'template': {
        'should replace variables': function () {
            var expectation = 'version: 1.2.3, name: Bender',
                confData = '{ "version": "1.2.3", "name": "Bender", "bob": { "template": { "foo.txt": ["version", "name"] } } }',
                charlotte = getTemplateCharlotte(confData, 'version: ${version}, name: ${name}', expectation);
            (new charlotte.Charlotte()).template('foo.txt');
        },
        'should not replace variable when none requested': function () {
            var expectation = 'version: ${version}, name: ${name}',
                confData = '{ "version": "1.2.3", "name": "Bender", "bob": { "template": { } } }',
                charlotte = getTemplateCharlotte(confData, 'version: ${version}, name: ${name}', expectation);
            (new charlotte.Charlotte()).template('foo.txt', []);
        }
    }
}).exportTo(module);