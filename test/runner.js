"use strict"
/* eslint no-unused-vars: 0 */
import child from 'child_process';
import fs from 'fs';
import mkdirp from 'mkdirp';
import sinon from 'sinon';
import runner from '../lib/runner.js';
import referee from '@sinonjs/referee';

describe('testrunner - exec', function() {

  beforeEach(function () {
    this.mockChild = sinon.mock(child);
    this.mockConsole = sinon.mock(console);
    this.mockFs = sinon.mock(fs);
    this.mockProcessStderr = sinon.mock(process.stderr);
    this.mockProcessStdout = sinon.mock(process.stdout);
  });

  afterEach(function () {
    this.mockChild.verify();
    this.mockChild.restore();
    this.mockConsole.verify();
    this.mockConsole.restore();
    this.mockFs.verify();
    this.mockFs.restore();
    this.mockProcessStderr.verify();
    this.mockProcessStderr.restore();
    this.mockProcessStdout.verify();
    this.mockProcessStdout.restore();
  });

  it('should write data to stream', function () {
    this.mockProcessStderr.expects('write').once().withExactArgs('somedata');
    this.mockProcessStdout.expects('write').once().withExactArgs('somedata');
    this.mockProcessStdout.expects('write').once().withArgs(sinon.match.string); // allow mocha test title display

    const mockChildProcess = {
      stderr: {
        on: function (event, cb) {
          referee.assert.equals(event, 'data');
          cb('somedata');
        }
      },
      stdout: {
        on: function (event, cb) {
          referee.assert.equals(event, 'data');
          cb('somedata');
        }
      }
    };
    const mockStream = {
      write: function (data) {
        referee.assert.equals(data, 'somedata');
      }
    };

    const opts = { task: 'lint', dir: 'somedir', type: 'jshint' };
    const cb = function (err) {};

    this.mockConsole.expects('log').withExactArgs('%s | %s', 'lint'.cyan, 'somecommand');
    this.mockChild.expects('exec').withExactArgs('somecommand', opts, cb).returns(mockChildProcess);
    this.mockFs.expects('createWriteStream').withExactArgs('somedir/jshint.out').returns(mockStream);

    runner.exec('somecommand', opts, cb);
  });

  it('should not write stderr and stdout data when in quiet mode', function () {
    this.mockProcessStderr.expects('write').never().withExactArgs('somedata');
    this.mockProcessStdout.expects('write').never().withExactArgs('somedata');
    this.mockProcessStdout.expects('write').once().withArgs(sinon.match.string); // allow mocha test title display

    const mockChildProcess = {
      stderr: {
        on: function (event, cb) {
          referee.assert.equals(event, 'data');
          cb('somedata');
        }
      },
      stdout: {
        on: function (event, cb) {
          referee.assert.equals(event, 'data');
          cb('somedata');
        }
      }
    };
    const mockStream = {
      write: function (data) {
        referee.assert.equals(data, 'somedata');
      }
    };

    const opts = { quiet: true, task: 'lint', dir: 'somedir', type: 'jshint' };
    const cb = function (err) {};

    this.mockConsole.expects('log').withExactArgs('%s | %s', 'lint'.cyan, 'somecommand');
    this.mockChild.expects('exec').withExactArgs('somecommand', opts, cb).returns(mockChildProcess);
    this.mockFs.expects('createWriteStream').withExactArgs('somedir/jshint.out').returns(mockStream);

    runner.exec('somecommand', opts, cb);
  });
});

describe('testrunner - execSeries', function() {

  beforeEach(function () {
    this.mockChild = sinon.mock(child);
    this.mockConsole = sinon.mock(console);
    this.mockFs = sinon.mock(fs);
    this.mockMkdirp = sinon.mock(mkdirp);
    this.mockProcessStderr = sinon.mock(process.stderr);
    this.mockProcessStdout = sinon.mock(process.stdout);
  });

  afterEach(function () {
    this.mockChild.verify();
    this.mockChild.restore();
    this.mockConsole.verify();
    this.mockConsole.restore();
    this.mockFs.verify();
    this.mockFs.restore();
    this.mockMkdirp.verify();
    this.mockMkdirp.restore();
    this.mockProcessStderr.verify();
    this.mockProcessStderr.restore();
    this.mockProcessStdout.verify();
    this.mockProcessStdout.restore();
  });

  it('should execute commands when there is no error', function (done) {
    this.mockProcessStderr.expects('write').once().withExactArgs('somedata');
    this.mockProcessStdout.expects('write').once().withExactArgs('somedata');
    this.mockProcessStdout.expects('write').once().withArgs(sinon.match.string); // allow mocha test title display
    const mockStream = {
      write: function (data) {
        referee.assert.equals(data, 'somedata');
      }
    };
    const mockChildProcess = {
      stderr: {
        on: function (event, cb) {
          referee.assert.equals(event, 'data');
          cb('somedata');
        }
      },
      stdout: {
        on: function (event, cb) {
          referee.assert.equals(event, 'data');
          cb('somedata');
        }
      }
    };
    this.mockConsole.expects('log').withExactArgs('%s | %s', 'test'.cyan, 'somecommand');
    this.mockChild.expects('exec').withArgs('somecommand', sinon.match.object, sinon.match.func).returns(mockChildProcess).callsArgWith(2);
    this.mockFs.expects('createWriteStream').withExactArgs('somedir/.bob/test/buster.out').returns(mockStream);
    const commands = [
      { meta: { task: 'test', type: 'buster' }, exec: 'somecommand'}
    ];
    const opts = {
      cwd: 'somedir'
    };
    this.mockMkdirp.expects('sync').withExactArgs('somedir/.bob/test');
    runner.execSeries(commands, opts, function (err) {
      done();
    });
  });

  it('should pass error when an error occurs while executing command', function (done) {
    const commands = [
      {
        meta: { task: 'test', type: 'buster' },
        exec: 'somecommand'
      }
    ];
    const opts = {
      cwd: 'somedir',
      task: 'test',
      type: 'buster',
      dir: 'somedir/.bob/test'
    };
    this.mockMkdirp.expects('sync').withExactArgs('somedir/.bob/test');
    this.mockConsole.expects('log').withExactArgs('%s | %s', 'test'.cyan, 'somecommand');
    this.mockChild.expects('exec').withArgs('somecommand', opts, sinon.match.func).callsArgWith(2, new Error('someerror'));
    this.mockFs.expects('createWriteStream').withExactArgs('somedir/.bob/test/buster.out');
    runner.execSeries(commands, opts, function (err) {
      referee.assert.equals(err.message, 'someerror');
      done();
    });
  });
});