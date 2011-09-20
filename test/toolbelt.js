var assert = require('assert'),
    Toolbelt = require('../lib/toolbelt').Toolbelt,
    vows = require('vows'),
    conf = { a: { b: { c: 'js-fu' } }, d: { e: { f: 'asyncism' } } };

vows.describe('Toolbelt').addBatch({
    'industry standard toolbelt': {
        topic: function () {
            return new Toolbelt();
        },
        'val should return value when property exists': function (topic) {
            assert.equal(topic.val(conf, 'a.b.c', 'default value'), 'js-fu');
        },
        'val should return undefined when property does not exist and no default value provided': function (topic) {
            assert.isUndefined(topic.val(conf, 'x.y.z'));
        },
        'val should return default value when property does not exist but default value provided': function (topic) {
            assert.equal(topic.val(conf, 'x.y.z', 'blah'), 'blah');
        },
        'val should return undefined when property is null and no default value provided': function (topic) {
            assert.isUndefined(topic.val(conf, null));
        },
        'val should return empty string when property is undefined and no default value provided': function (topic) {
            assert.isUndefined(topic.val(conf, undefined));
        },
        'args should return Makefile argument string when params are provided': function (topic) {
            var params = [
                    { name: 'A_B_C', defaultVal: 'some default' },
                    { name: 'X_Y_Z', defaultVal: 'woo hoo'},
                    { name: 'D_E_F' },
                    { name: 'FOOBAR' }
                ];
            assert.equal(topic.args(conf, params),
                'A_B_C="js-fu" X_Y_Z="woo hoo" D_E_F="asyncism" FOOBAR=""');
        },
        'args should return empty string when params is an empty string': function (topic) {
            assert.equal(topic.args(conf, []), '');
        },
        'args should return empty string when params is null': function (topic) {
            assert.equal(topic.args(conf, null), '');
        },
        'args should return empty string when params is undefined': function (topic) {
            assert.equal(topic.args(conf, undefined), '');
        },
        'merge should return an object with properties from multiple objects': function (topic) {
            var o = {
                    foo: 'bar',
                    a: 'xyz'
                },
                merge = topic.merge([o, conf]);
            assert.equal(merge.foo, 'bar');
            assert.equal(merge.a.b.c, 'js-fu');
            assert.equal(merge.d.e.f, 'asyncism');
        },
        'merge should return empty object when there is nothing to merge': function (topic) {
            var merge = topic.merge([]);
            assert.isEmpty(merge);
        }
    }
}).export(module);
