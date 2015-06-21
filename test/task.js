var buster = require('buster-node'),
  fs = require('fs'),
  task = require('../lib/task'),
  referee = require('referee'),
  assert = referee.assert;

buster.testCase('testtask - load', {
  setUp: function () {
    this.mockFs = this.mock(fs);
  },
  'should pass error to callback when one of the task files do not exist': function (done) {
    this.mockFs.expects('exists').withArgs('somedir/someexistingtask.json').callsArgWith(1, true);
    this.mockFs.expects('exists').withArgs('somedir/someinexistingtask.json').callsArgWith(1, false);
    this.mockFs.expects('readFile').withArgs('somedir/someexistingtask.json').callsArgWith(1, null, '{ "name": "existing" }');
    task.load(['someexistingtask', 'someinexistingtask'], 'somedir', function (err, results) {
      assert.equals(err.message, 'Unknown command: someinexistingtask, use --help for more info');
      done();
    });
  },
  'should pass results to callback when all task files exist': function (done) {
    this.mockFs.expects('exists').withArgs('somedir/someexistingtask1.json').callsArgWith(1, true);
    this.mockFs.expects('exists').withArgs('somedir/someexistingtask2.json').callsArgWith(1, true);
    this.mockFs.expects('readFile').withArgs('somedir/someexistingtask1.json').callsArgWith(1, null, '{ "name": "existing1" }');
    this.mockFs.expects('readFile').withArgs('somedir/someexistingtask2.json').callsArgWith(1, null, '{ "name": "existing2" }');
    task.load(['someexistingtask1', 'someexistingtask2'], 'somedir', function (err, results) {
      assert.equals(err, null);
      assert.equals(results.someexistingtask1.name, 'existing1');
      assert.equals(results.someexistingtask2.name, 'existing2');
      done();
    });
  }
});
