"use strict"
import canihaz from 'canihaz-pakkunbot';
import deps from '../lib/deps.js';
import fs from 'fs';
import sinon from 'sinon';
import referee from '@sinonjs/referee';

describe('testdeps - install', function() {

  beforeEach(function () {
    this.mockConsole = sinon.mock(console);
    this.mockFs = sinon.mock(fs);
  });

  afterEach(function () {
    this.mockConsole.verify();
    this.mockConsole.restore();
    this.mockFs.verify();
    this.mockFs.restore();
  });

  it('should pass error to callback when an error occurs while reading node_modules directory', function (done) {
    this.mockFs.expects('readdir').once().withArgs('somedir/node_modules').callsArgWith(1, new Error('someerror'));
    deps.install([ 'buster', 'kaiju', 'npm' ], { dir: 'somedir' }, function (err) {
      referee.assert.equals(err.message, 'someerror');
      done();
    });
  });

  it('should only install uninstalled and non-global modules', function (done) {
    this.mockConsole.expects('log').once().withExactArgs('[deps] Installing modules: %s (might take a while, once-off only)', 'kaiju');
    var mockCanihaz = function (opts) {
      referee.assert.equals(opts.key, 'optDependencies');
      return function (depNames, cb) {
        referee.assert.equals(depNames, 'kaiju');
        cb();
      };
    };
    sinon.stub(canihaz, 'install').value(mockCanihaz);
    var installed = ['buster'];
    this.mockFs.expects('readdir').once().withArgs('somedir/node_modules').callsArgWith(1, null, installed);
    deps.install([ 'buster', 'kaiju', 'npm' ], { dir: 'somedir' }, function (err) {
      referee.assert.isUndefined(err);
      done();
    });
  });

  it('should only install each module once', function (done) {
    this.mockConsole.expects('log').once().withExactArgs('[deps] Installing modules: %s (might take a while, once-off only)', 'kaiju');
    var mockCanihaz = function (opts) {
      referee.assert.equals(opts.key, 'optDependencies');
      return function (depNames, cb) {
        referee.assert.equals(depNames, 'kaiju');
        cb();
      };
    };
    sinon.stub(canihaz, 'install').value(mockCanihaz);
    var installed = ['buster'];
    this.mockFs.expects('readdir').once().withArgs('somedir/node_modules').callsArgWith(1, null, installed);
    deps.install([ 'kaiju', 'kaiju', 'kaiju', 'kaiju', 'kaiju' ], { dir: 'somedir' }, function (err) {
      referee.assert.isUndefined(err);
      done();
    });
  });

  it('should not do anything when all modules are already installed', function (done) {
    var installed = ['buster', 'kaiju'];
    this.mockFs.expects('readdir').once().withArgs('somedir/node_modules').callsArgWith(1, null, installed);
    deps.install([ 'buster', 'kaiju', 'npm' ], { dir: 'somedir' }, function (err) {
      referee.assert.isUndefined(err);
      done();
    });
  });
});
