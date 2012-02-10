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
        var value = topic.apply(null, { foo: 'bar' });
        assert.isNull(value);
      }
    },
    'when params is null': {
      'then value should be the original data': function (topic) {
        var value = topic.apply('hello ${foo} world', null);
        assert.equal(value, 'hello ${foo} world');
      }
    },
    'when data uses param that does not exist': {
      'then value should be the original data': function (topic) {
        var value = topic.apply('hello ${foo} world', { blah: 'bar' });
        assert.equal(value, 'hello ${foo} world');
      }
    },
    'when data uses param that exists': {
      'then value should contain the param value': function (topic) {
        var value = topic.apply('hello ${foo} world', { foo: 'bar' });
        assert.equal(value, 'hello bar world');
      }
    },
    'when data contains multiple params that three exists one does not': {
      'then value should contain the params value': function (topic) {
        var value = topic.apply('hello ${foo} world ${blah} hey ${foo} now ${a}', { foo: 'bar', a: 'b' });
        assert.equal(value, 'hello bar world ${blah} hey bar now b');
      }
    },
    'when data contains now function call': {
      'then value should contain now value': function (topic) {
        var value = topic.apply('hello ${now(\'yyyy\')} world', { foo: 'bar' });
        assert.equal(value, 'hello 2000 world');
      }
    }
  },
  'val': {
    topic: function () {
      return util;
    },
    'when dsv is null': {
      'then value should be undefined': function (topic) {
        var value = topic.val(null, { foo: 'bar' });
        assert.isUndefined(value);
      }
    },
    'when object is null': {
      'then value should be undefined': function (topic) {
        var value = topic.val('x.y.z', null);
        assert.isUndefined(value);
      }
    },
    'when property does not exist in object': {
      'then value should be undefined': function (topic) {
        var value = topic.val('x.y.z', { foo: 'bar' });
        assert.isUndefined(value);
      }
    },
    'when property exists in object': {
      'then value should be undefined': function (topic) {
        var value = topic.val('x.y.z', { x: { y: { z: 'bar' } } });
        assert.equal(value, 'bar');
      }
    }
  }
}).exportTo(module);