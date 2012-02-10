var assert = require('assert'),
  sandbox = require('sandboxed-module'),
  util = require('../lib/util'),
  vows = require('vows');

vows.describe('util').addBatch({
  'apply': {
    topic: function () {
      return sandbox.require('../lib/util', {
        requires: {
          dateformat: function(date, format) {
            assert.equal(format, 'yyyy');
            return '2000';
          }
        }
      });
    },
    'when data is null': {
      'then value should be the original data': function (topic) {
        var val = topic.apply(null, { foo: 'bar' });
        assert.isNull(val);
      }
    },
    'when params is null': {
      'then value should be the original data': function (topic) {
        var val = topic.apply('hello ${foo} world', null);
        assert.equal(val, 'hello ${foo} world');
      }
    },
    'when data uses param that does not exist': {
      'then value should be the original data': function (topic) {
        var val = topic.apply('hello ${foo} world', { blah: 'bar' });
        assert.equal(val, 'hello ${foo} world');
      }
    },
    'when data uses param that exists': {
      'then value should contain the param value': function (topic) {
        var val = topic.apply('hello ${foo} world', { foo: 'bar' });
        assert.equal(val, 'hello bar world');
      }
    },
    'when data contains multiple params that three exists one does not': {
      'then value should contain the params value': function (topic) {
        var val = topic.apply('hello ${foo} world ${blah} hey ${foo} now ${a}', { foo: 'bar', a: 'b' });
        assert.equal(val, 'hello bar world ${blah} hey bar now b');
      }
    },
    'when data contains now function call': {
      'then value should contain now value': function (topic) {
        var val = topic.apply('hello ${now(\'yyyy\')} world', { foo: 'bar' });
        assert.equal(val, 'hello 2000 world');
      }
    }
  },
  'val': {
    topic: function () {
      return util;
    },
    'when dsv is null': {
      'then value should be undefined': function (topic) {
        var val = topic.val(null, { foo: 'bar' });
        assert.isUndefined(val);
      }
    },
    'when object is null': {
      'then value should be undefined': function (topic) {
        var val = topic.val('x.y.z', null);
        assert.isUndefined(val);
      }
    },
    'when property does not exist in object': {
      'then value should be undefined': function (topic) {
        var val = topic.val('x.y.z', { foo: 'bar' });
        assert.isUndefined(val);
      }
    },
    'when property exists in object': {
      'then value should be undefined': function (topic) {
        var val = topic.val('x.y.z', { x: { y: { z: 'bar' } } });
        assert.equal(val, 'bar');
      }
    }
  }
}).exportTo(module);