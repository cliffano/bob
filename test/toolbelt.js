var assert = require('assert'),
    Toolbelt = require('../lib/toolbelt').Toolbelt,
    vows = require('vows'),
    conf = { name: 'myproject', version: '8.8.8', path: '/foo/bar/${name}/${version}', 
        a: { b: { c: 'js-fu' } }, d: { e: { f: 'asyncism' } } };

vows.describe('Toolbelt').addBatch({
    'industry standard toolbelt': {
        topic: function () {
            return new Toolbelt();
        },
        'val should return value when property exists': function (topic) {
            assert.equal(topic.val(conf, 'a.b.c', 'default value'), 'js-fu');
        },
        'val should return value with overridden variables': function (topic) {
            assert.equal(topic.val(conf, 'path', 'default value'), '/foo/bar/myproject/8.8.8');
        },
        'val should return default value with overridden variables': function (topic) {
            assert.equal(topic.val(conf, 'inexistentpath', '/default/value/${name}/${version}'), '/default/value/myproject/8.8.8');
        },
        'val should return undefined when property does not exist and no default value provided':
        function (topic) {
            assert.isUndefined(topic.val(conf, 'x.y.z'));
        },
        'val should return default value when property does not exist but default value provided':
        function (topic) {
            assert.equal(topic.val(conf, 'x.y.z', 'blah'), 'blah');
        },
        'val should return undefined when property is null and no default value provided':
        function (topic) {
            assert.isUndefined(topic.val(conf, null));
        },
        'val should return undefined when property is undefined and no default value provided':
        function (topic) {
            assert.isUndefined(topic.val(conf, undefined));
        },
        'args should return argument array when params are provided': function (topic) {
            var params = [
                    { name: 'A_B_C', defaultVal: 'some default' },
                    { name: 'X_Y_Z', defaultVal: 'woo hoo'},
                    { name: 'D_E_F' },
                    { name: 'FOOBAR' }
                ],
                args = topic.args(conf, params);
            assert.equal(args.length, 4);
            assert.equal(args[0], 'A_B_C=js-fu');
            assert.equal(args[1], 'X_Y_Z=woo hoo');
            assert.equal(args[2], 'D_E_F=asyncism');
            assert.equal(args[3], 'FOOBAR=');
        },
        'args should return empty array when params is an empty array': function (topic) {
            assert.isEmpty(topic.args(conf, []));
        },
        'args should return empty array when params is null': function (topic) {
            assert.isEmpty(topic.args(conf, null));
        },
        'args should return empty array when params is undefined': function (topic) {
            assert.isEmpty(topic.args(conf, undefined));
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
        'merge should return an object with nested properties': function (topic) {
            var o = {
                    foo: 'bar',
                    a: {
                        b: {
                            d: 'awesome'
                        }
                    }
                },
                merge = topic.merge([o, conf]);
            assert.equal(merge.foo, 'bar');
            assert.equal(merge.a.b.c, 'js-fu');
            assert.equal(merge.a.b.d, 'awesome');
            assert.equal(merge.d.e.f, 'asyncism');
        },
        'merge should return empty object when there is nothing to merge': function (topic) {
            var merge = topic.merge([]);
            assert.isEmpty(merge);
        }
    }
}).exportTo(module);
