var bag = require('bagofholding'),
  sandbox = require('sandboxed-module'),
  should = require('should'),
  checks, mocks,
  make;

describe('make', function () {

  function create(checks, mocks) {
    return sandbox.require('../lib/make', {
      requires: {
        bagofholding: {
          cli: {
            spawn: function (command, args, cb) {
              checks.spawn_command = command;
              checks.spawn_args = args;
              cb();
            }
          }
        }
      },
      globals: {
        console: bag.mock.console(checks, mocks)
      }
    });
  }

  beforeEach(function () {
    checks = {};
    mocks = {};
  });

  describe('exec', function () {

    it('should set silent flag when verbose is set to false', function (done) {
      make = new (create(checks, mocks))('path/to/makefile', false);
      make.exec({}, [], function (err, result) {
        done();
      });
      checks.spawn_command.should.equal('make');
      (checks.spawn_args.indexOf('--silent') >= 0).should.equal(true);
    });

    it('should log make arguments when verbose is set to true', function (done) {
      make = new (create(checks, mocks))('path/to/makefile', true);
      make.exec({}, [], function (err, result) {
        done();
      });
      checks.spawn_command.should.equal('make');
      checks.console_log_messages.length.should.equal(1);
      checks.console_log_messages[0].should.equal('Make arguments:\n\t--file\n\tpath/to/makefile');
    });

    it('should set file flag with specified makefile path', function (done) {
      make = new (create(checks, mocks))('path/to/makefile', true);
      make.exec({}, [], function (err, result) {
        done();
      });
      checks.spawn_command.should.equal('make');
      checks.spawn_args.length.should.equal(2);
      checks.spawn_args[0].should.equal('--file');
      checks.spawn_args[1].should.equal('path/to/makefile');
    });

    it('should set targets as make arguments', function (done) {
      make = new (create(checks, mocks))('path/to/makefile', true);
      make.exec({}, ['clean', 'lint', 'test'], function (err, result) {
        done();
      });
      checks.spawn_command.should.equal('make');
      checks.spawn_args.length.should.equal(5);
      checks.spawn_args[0].should.equal('--file');
      checks.spawn_args[1].should.equal('path/to/makefile');
      checks.spawn_args[2].should.equal('clean');
      checks.spawn_args[3].should.equal('lint');
      checks.spawn_args[4].should.equal('test');
    });

    it('should set formatted make parameters when params is provided', function (done) {
      make = new (create(checks, mocks))('path/to/makefile', true);
      make.exec({ foo: 'bar', abc: 'xyz'}, [], function (err, result) {
        done();
      });
      checks.spawn_command.should.equal('make');
      checks.spawn_args.length.should.equal(4);
      checks.spawn_args[0].should.equal('--file');
      checks.spawn_args[1].should.equal('path/to/makefile');
      checks.spawn_args[2].should.equal('foo=bar');
      checks.spawn_args[3].should.equal('abc=xyz');
    });
  });
});
 