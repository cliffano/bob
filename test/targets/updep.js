var bag = require('bagofholding'),
  sandbox = require('sandboxed-module'),
  should = require('should'),
  checks, mocks,
  updep;

describe('updep', function () {

  function create(checks, mocks) {
    return sandbox.require('../../lib/targets/updep', {
      requires: {
        fs: bag.mock.fs(checks, mocks),
        request: function (url, cb) {
          if (url === 'https://registry.npmjs.org/foo/latest') {
            cb(null, {
              statusCode: 200,
              body: '{ "name": "foo", "version": "8.8.8" }'
            });
          } else if (url === 'https://registry.npmjs.org/bar/latest') {
            cb(null, {
              statusCode: 200,
              body: '{ "name": "bar", "version": "9.9.9" }'
            });
          } else if (url === 'https://registry.npmjs.org/someerror/latest') {
            cb(new Error('Some connection error'));
          } else if (url === 'https://registry.npmjs.org/someunexpectedstatuscode/latest') {
            cb(null, {
              statusCode: 503,
              body: 'Some unexpected status body'
            });
          } else {
            cb(null, {
              statusCode: 404
            });
          }
        }
      },
      globals: {
        console: bag.mock.console(checks),
        process: bag.mock.process(checks, mocks)
      }
    });
  }

  beforeEach(function () {
    checks = {};
    mocks = {
      process_cwd: '/curr/dir'
    };
  });

  describe('exec', function () {

    it('should set all dependencies to latest version', function () {
      updep = create(checks, mocks);
      updep.exec({
        _bob: {
          pkg: {
            dependencies: {
              foo: '1.2.3'
            },
            devDependencies: {
              bar: '5.6.7'
            }
          }
        }
      });
      checks.fs_writeFileSync_file.should.equal('/curr/dir/package.json');
      var pkg = JSON.parse(checks.fs_writeFileSync_data);
      pkg.dependencies.foo.should.equal('8.8.8');
      pkg.devDependencies.bar.should.equal('9.9.9');
      checks.console_log_messages.length.should.equal(2);
      checks.console_log_messages[0].should.equal('foo - upgrade to v8.8.8');
      checks.console_log_messages[1].should.equal('bar - upgrade to v9.9.9');
    });

    it('should keep original version when dependency cannot be found', function () {
      updep = create(checks, mocks);
      updep.exec({
        _bob: {
          pkg: {
            dependencies: {
              nonexistent1: '1.2.3'
            },
            devDependencies: {
              nonexistent2: '5.6.7'
            }
          }
        }
      });
      checks.fs_writeFileSync_file.should.equal('/curr/dir/package.json');
      var pkg = JSON.parse(checks.fs_writeFileSync_data);
      pkg.dependencies.nonexistent1.should.equal('1.2.3');
      pkg.devDependencies.nonexistent2.should.equal('5.6.7');
      checks.console_log_messages.length.should.equal(2);
      checks.console_log_messages[0].should.equal('nonexistent1 - not found');
      checks.console_log_messages[1].should.equal('nonexistent2 - not found');
    });

    it('should pass error message when connecting to registry results in an error', function () {
      updep = create(checks, mocks);
      updep.exec({
        _bob: {
          pkg: {
            dependencies: {
              someunexpectedstatuscode: '1.2.3'
            }
          }
        }
      });
      checks.console_error_messages.length.should.equal(1);
      checks.console_error_messages[0].should.equal('Unexpected status code 503 from npm registry\nResponse body:\nSome unexpected status body');
    });

    it('should pass error message when response status code is not expected', function () {
      updep = create(checks, mocks);
      updep.exec({
        _bob: {
          pkg: {
            dependencies: {
              someerror: '1.2.3'
            }
          }
        }
      });
      checks.console_error_messages.length.should.equal(1);
      checks.console_error_messages[0].should.equal('Some connection error');
    });
  });
});
 