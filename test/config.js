"use strict";
import config from '../lib/config.js';
import fs from 'fs';
import sinon from 'sinon';
import referee from '@sinonjs/referee';

describe('testconfig - load', function() {

  beforeEach(function () {
    this.mockFs = sinon.mock(fs);
  });

  afterEach(function () {
    this.mockFs.verify();
    this.mockFs.restore();
  });

  it('should pass empty object when config file does not exist', function (done) {
    this.mockFs.expects('exists').withArgs('somedir/.bob.json').callsArgWith(1, false);
    config.load([], 'somedir', function (err, result) {
      referee.assert.isNull(err);
      referee.assert.equals(result, {});
      done();
    });
  });

  it('should pass specified task in config object when config file exists', function (done) {
    this.mockFs.expects('exists').withArgs('somedir/.bob.json').callsArgWith(1, true);
    this.mockFs.expects('readFile').withArgs('somedir/.bob.json').callsArgWith(1, null, '{ "sometask": "foobar" }');
    config.load(['sometask'], 'somedir', function (err, result) {
      referee.assert.isNull(err);
      referee.assert.equals(result, { sometask: 'foobar' });
      done();
    });
  });

  it('should not pass specified task in config object when task does not exist', function (done) {
    this.mockFs.expects('exists').withArgs('somedir/.bob.json').callsArgWith(1, true);
    this.mockFs.expects('readFile').withArgs('somedir/.bob.json').callsArgWith(1, null, '{ "sometask": "foobar", "someothertask": "otherfoobar" }');
    config.load(['sometask'], 'somedir', function (err, result) {
      referee.assert.isNull(err);
      referee.assert.equals(result, { sometask: 'foobar' });
      done();
    });
  });

  it('should pass error when an error occurs while reading config file', function (done) {
    this.mockFs.expects('exists').withArgs('somedir/.bob.json').callsArgWith(1, true);
    this.mockFs.expects('readFile').withArgs('somedir/.bob.json').callsArgWith(1, new Error('someerror'));
    config.load(['sometask'], 'somedir', function (err, result) {
      referee.assert.equals(err.message, 'someerror');
      referee.assert.isUndefined(result);
      done();
    });
  });
});