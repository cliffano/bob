var buster = require('buster'),
  config = require('../lib/config'),
  fs = require('fs'),
  referee = require('referee'),
  assert = referee.assert;

buster.testCase('testconfig - load', {
  setUp: function () {
    this.mockFs = this.mock(fs);
  },
  'should pass empty object when config file does not exist': function (done) {
    this.mockFs.expects('exists').withArgs('somedir/.bob.json').callsArgWith(1, false);
    config.load([], 'somedir', function (err, result) {
      assert.isNull(err);
      assert.equals(result, {});
      done();
    });
  },
  'should pass specified task in config object when config file exists': function (done) {
    this.mockFs.expects('exists').withArgs('somedir/.bob.json').callsArgWith(1, true);
    this.mockFs.expects('readFile').withArgs('somedir/.bob.json').callsArgWith(1, null, '{ "sometask": "foobar" }');
    config.load(['sometask'], 'somedir', function (err, result) {
      assert.isNull(err);
      assert.equals(result, { sometask: 'foobar' });
      done();
    });
  },
  'should not pass specified task in config object when task does not exist': function (done) {
    this.mockFs.expects('exists').withArgs('somedir/.bob.json').callsArgWith(1, true);
    this.mockFs.expects('readFile').withArgs('somedir/.bob.json').callsArgWith(1, null, '{ "sometask": "foobar" }');
    config.load(['sometask'], 'somedir', function (err, result) {
      assert.isNull(err);
      assert.equals(result, { sometask: 'foobar' });
      done();
    });
  },
  'should pass error when an error occurs while reading config file': function (done) {
    this.mockFs.expects('exists').withArgs('somedir/.bob.json').callsArgWith(1, true);
    this.mockFs.expects('readFile').withArgs('somedir/.bob.json').callsArgWith(1, new Error('someerror'));
    config.load(['sometask'], 'somedir', function (err, result) {
      assert.equals(err.message, 'someerror');
      assert.equals(result, undefined);
      done();
    });
  }
});