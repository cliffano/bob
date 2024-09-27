"use strict";
/* eslint no-unused-vars: 0 */
import fs from 'fs';
import sinon from 'sinon';
import task from '../lib/task.js';
import referee from '@sinonjs/referee';

describe('testtask - load', function() {

  beforeEach(function () {
    this.mockFs = sinon.mock(fs);
  });

  afterEach(function () {
    this.mockFs.verify();
    this.mockFs.restore();
  });

  it('should pass error to callback when one of the task files do not exist', function (done) {
    this.mockFs.expects('access').withArgs('somedir/someexistingtask.json', fs.constants.F_OK, sinon.match.func).callsArgWith(2);
    this.mockFs.expects('access').withArgs('somedir/someinexistingtask.json', fs.constants.F_OK, sinon.match.func).callsArgWith(2, new Error('someerror'));
    this.mockFs.expects('readFile').withArgs('somedir/someexistingtask.json').callsArgWith(1, null, '{ "name": "existing" }');
    task.load(['someexistingtask', 'someinexistingtask'], 'somedir', function (err, results) {
      referee.assert.equals(err.message, 'Unknown command: someinexistingtask, use --help for more info');
      done();
    });
  });

  it('should pass results to callback when all task files exist', function (done) {
    this.mockFs.expects('access').withArgs('somedir/someexistingtask1.json', fs.constants.F_OK, sinon.match.func).callsArgWith(2);
    this.mockFs.expects('access').withArgs('somedir/someexistingtask2.json', fs.constants.F_OK, sinon.match.func).callsArgWith(2);
    this.mockFs.expects('readFile').withArgs('somedir/someexistingtask1.json').callsArgWith(1, null, '{ "name": "existing1" }');
    this.mockFs.expects('readFile').withArgs('somedir/someexistingtask2.json').callsArgWith(1, null, '{ "name": "existing2" }');
    task.load(['someexistingtask1', 'someexistingtask2'], 'somedir', function (err, results) {
      referee.assert.equals(err, null);
      referee.assert.equals(results.someexistingtask1.name, 'existing1');
      referee.assert.equals(results.someexistingtask2.name, 'existing2');
      done();
    });
  });
});
