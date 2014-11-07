var buster = require('buster-node'),
  child = require('child_process'),
  fs = require('fs'),
  referee = require('referee'),
  runner = require('../lib/runner'),
  assert = referee.assert;

buster.testCase('testrunner - exec', {
  setUp: function () {
    this.mockChild = this.mock(child);
    this.mockConsole = this.mock(console);
    this.mockFs = this.mock(fs);
    this.mockProcessStderr = this.mock(process.stderr);
    this.mockProcessStdout = this.mock(process.stdout);
  },
  'should write data to stream': function () {
    this.mockProcessStderr.expects('write').once().withExactArgs('somedata');
    this.mockProcessStdout.expects('write').once().withExactArgs('somedata');

    var mockChildProcess = {
      stderr: {
        on: function (event, cb) {
          assert.equals(event, 'data');
          cb('somedata');
        }
      },
      stdout: {
        on: function (event, cb) {
          assert.equals(event, 'data');
          cb('somedata');
        }
      }
    };
    var mockStream = {
      write: function (data) {
        assert.equals(data, 'somedata');
      }
    };

    var opts = { task: 'lint', dir: 'somedir', type: 'jshint' };
    var cb = function (err) {};

    this.mockConsole.expects('log').withExactArgs('%s | %s', 'lint'.cyan, 'somecommand');
    this.mockChild.expects('exec').withExactArgs('somecommand', opts, cb).returns(mockChildProcess);
    this.mockFs.expects('createWriteStream').withExactArgs('somedir/jshint.out').returns(mockStream);

    runner.exec('somecommand', opts, cb);
  },
  'should not write stderr and stdout data when in quiet mode': function () {
    this.mockProcessStderr.expects('write').never().withExactArgs('somedata');
    this.mockProcessStdout.expects('write').never().withExactArgs('somedata');

    var mockChildProcess = {
      stderr: {
        on: function (event, cb) {
          assert.equals(event, 'data');
          cb('somedata');
        }
      },
      stdout: {
        on: function (event, cb) {
          assert.equals(event, 'data');
          cb('somedata');
        }
      }
    };
    var mockStream = {
      write: function (data) {
        assert.equals(data, 'somedata');
      }
    };

    var opts = { quiet: true, task: 'lint', dir: 'somedir', type: 'jshint' };
    var cb = function (err) {};

    this.mockConsole.expects('log').withExactArgs('%s | %s', 'lint'.cyan, 'somecommand');
    this.mockChild.expects('exec').withExactArgs('somecommand', opts, cb).returns(mockChildProcess);
    this.mockFs.expects('createWriteStream').withExactArgs('somedir/jshint.out').returns(mockStream);

    runner.exec('somecommand', opts, cb);
  }
});

buster.testCase('testrunner - execSeries', {
  setUp: function () {
    this.mockChild = this.mock(child);
    this.mockConsole = this.mock(console);
    this.mockFs = this.mock(fs);
    this.mockProcessStderr = this.mock(process.stderr);
    this.mockProcessStdout = this.mock(process.stdout);
  },
  'should execute commands when there is no error': function () {
    this.mockProcessStderr.expects('write').once().withExactArgs('somedata');
    this.mockProcessStdout.expects('write').once().withExactArgs('somedata');
    var mockStream = {
      write: function (data) {
        assert.equals(data, 'somedata');
      }
    };
    var mockChildProcess = {
      stderr: {
        on: function (event, cb) {
          assert.equals(event, 'data');
          cb('somedata');
        }
      },
      stdout: {
        on: function (event, cb) {
          assert.equals(event, 'data');
          cb('somedata');
        }
      }
    };
    this.mockConsole.expects('log').withExactArgs('%s | %s', 'test'.cyan, 'somecommand');
    this.mockChild.expects('exec').withArgs('somecommand').returns(mockChildProcess);
    this.mockFs.expects('createWriteStream').withExactArgs('somedir/.bob/test/buster.out').returns(mockStream);
    var mockMkdirp = function (dir, cb) {
      assert.equals(dir, 'somedir/.bob/test');
      cb();
    };
    var commands = [
      { meta: { task: 'test', type: 'buster' }, exec: 'somecommand'}
    ];
    var opts = {
      cwd: 'somedir',
      mkdirp: mockMkdirp
    };
    runner.execSeries(commands, opts, function (err) {
      done();
    });
  },
  'should pass error when an error occurs while executing command': function (done) {
    var mockMkdirp = function (dir, cb) {
      assert.equals(dir, 'somedir/.bob/test');
      cb(new Error('someerror'));
    };
    var commands = [
      { meta: { task: 'test', type: 'buster' }}
    ];
    var opts = {
      cwd: 'somedir',
      mkdirp: mockMkdirp
    };
    runner.execSeries(commands, opts, function (err) {
      assert.equals(err.message, 'someerror');
      done();
    });
  }
});