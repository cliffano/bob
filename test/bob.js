var assert = require('assert'),
    Bob = require('../lib/bob').Bob,
    Toolbelt = require('../lib/toolbelt').Toolbelt,
    vows = require('vows'),
    conf = { "scripts": { "test": "some test cmd", "stop": "some stop cmd" } };

vows.describe('Bob').addBatch({
    'the builder, Bob': {
        topic: function () {
            return new Bob(new Toolbelt(), conf);
        },
        'plan should keep original tasks if none of them is overridable': function (topic) {
            var tasks = topic.plan([ 'foo', 'bar' ]);
            assert.equal(tasks.length, 2);
            assert.equal(tasks[0], 'foo');
            assert.equal(tasks[1], 'bar');
        },
        'plan should keep original tasks if not configured even though overridable':
        function (topic) {
            var tasks = topic.plan([ 'start', 'restart' ]);
            assert.equal(tasks.length, 2);
            assert.equal(tasks[0], 'start');
            assert.equal(tasks[1], 'restart');
        },
        'plan should replace original tasks if configured and overridable': function (topic) {
            var tasks = topic.plan([ 'test', 'stop' ]);
            assert.equal(tasks.length, 2);
            assert.equal(tasks[0], 'test-npm');
            assert.equal(tasks[1], 'stop-npm');
        }
    }
}).exportTo(module);