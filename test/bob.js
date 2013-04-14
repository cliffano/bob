var bag = require('bagofholding'),
  _jscov = require('../lib/bob'),
  sandbox = require('sandboxed-module'),
  should = require('should'),
  checks, mocks,
  bob;

describe('bob', function () {

  function create(checks, mocks) {
    return sandbox.require('../lib/bob', {
      requires: {
        fs: bag.mock.fs(checks, mocks),
        './make': function (file, verbose) {
          checks.make_file = file;
          checks.make_verbose = verbose;
          return {
            exec: function (params, targets, cb) {
              checks.make_exec_params = params;
              checks.make_exec_targets = targets;
              cb();
            }
          };
        },
        './targets/blah': {
          exec: function (opts, cb) {
            checks.exec_opts = opts;
            checks.exec_cb = cb;
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
      process_cwd: '/curr/dir',
      process_env: {}
    };
  });

  describe('external', function () {

    it('should pass makefile, verbose, constructed params and targets to make', function () {
      bob = new (create(checks, mocks))(
        '/app/bob',
        { lint: { 'default': 'jshint', types: { jshint: { 'bin': '/usr/bin/jshint' } } } },
        {},
        { name: 'someapp', version: '1.2.3' });
      bob.external(['clean', 'lint'], 'robot', true, function () {
      });
      checks.make_file.should.equal('/app/bob/bin/Makefile');
      checks.make_verbose.should.equal(true);
      checks.make_exec_params.app.should.equal('/curr/dir');
      checks.make_exec_params.bob.should.equal('/app/bob');
      checks.make_exec_params.src.should.equal('/curr/dir');
      checks.make_exec_params.name.should.equal('someapp');
      checks.make_exec_params.version.should.equal('1.2.3');
      checks.make_exec_params.lint_bin.should.equal('/usr/bin/jshint');
      checks.make_exec_targets.length.should.equal(2);
      checks.make_exec_targets[0].should.equal('clean');
      checks.make_exec_targets[1].should.equal('lint');
    });

    it('should expand alias target when an alias is configured in custom .bob.json', function () {
      bob = new (create(checks, mocks))(
        '/app/bob',
        {},
        { somealias1: ' clean  lint', somealias2: ' test coverage ' },
        { name: 'someapp', version: '1.2.3', scripts: { test: 'vows test/' } });
      bob.external(['foo', 'somealias1', 'bar', 'somealias2', 'send'], 'robot', true, function () {
      });
      checks.make_file.should.equal('/app/bob/bin/Makefile');
      checks.make_verbose.should.equal(true);
      checks.make_exec_targets.length.should.equal(7);
      checks.make_exec_targets[0].should.equal('foo');
      checks.make_exec_targets[1].should.equal('clean');
      checks.make_exec_targets[2].should.equal('lint');
      checks.make_exec_targets[3].should.equal('bar');
      checks.make_exec_targets[4].should.equal('test');
      checks.make_exec_targets[5].should.equal('coverage');
      checks.make_exec_targets[6].should.equal('send');
    });

    it('should override target when override property exists in custom .bob.json', function () {
      bob = new (create(checks, mocks))(
        '/app/bob',
        { test: { 'default': 'mocha', types: { mocha: { 'bin': '/usr/bin/mocha' } }, overrides: { pkg: { 'test-npm': 'scripts.test' }} } },
        {},
        { name: 'someapp', version: '1.2.3', scripts: { test: 'vows test/' } });
      bob.external(['clean', 'test'], 'robot', true, function () {
      });
      checks.make_file.should.equal('/app/bob/bin/Makefile');
      checks.make_verbose.should.equal(true);
      checks.make_exec_targets.length.should.equal(2);
      checks.make_exec_targets[0].should.equal('clean');
      checks.make_exec_targets[1].should.equal('test-npm');
    });

    it('should use default type when type is not overridden in .bob.json custom config', function () {
      bob = new (create(checks, mocks))(
        '/app/bob',
        { lint: { 'default': 'jshint', types: { jshint: { 'bin': '/usr/bin/jshint' }, nodelint: { 'bin': '/usr/bin/nodelint' } } } },
        {},
        { name: 'someapp', version: '1.2.3' });
      bob.external(['clean', 'lint'], 'robot', true, function () {
      });
      checks.make_file.should.equal('/app/bob/bin/Makefile');
      checks.make_verbose.should.equal(true);
      checks.make_exec_params.lint_type.should.equal('jshint');
      checks.make_exec_params.lint_bin.should.equal('/usr/bin/jshint');
      checks.make_exec_targets.length.should.equal(2);
      checks.make_exec_targets[0].should.equal('clean');
      checks.make_exec_targets[1].should.equal('lint');
    });

    it('should override type when type is configured in .bob.json custom config', function () {
      bob = new (create(checks, mocks))(
        '/app/bob',
        { lint: { 'default': 'jshint', types: { jshint: { 'bin': '/usr/bin/jshint' }, nodelint: { 'bin': '/usr/bin/nodelint' } } } },
        { lint: { type: 'nodelint', bin: '/usr/local/bin/nodelint' }},
        { name: 'someapp', version: '1.2.3' });
      bob.external(['clean', 'lint'], 'robot', true, function () {
      });
      checks.make_file.should.equal('/app/bob/bin/Makefile');
      checks.make_verbose.should.equal(true);
      checks.make_exec_params.lint_type.should.equal('nodelint');
      checks.make_exec_params.lint_bin.should.equal('/usr/local/bin/nodelint');
      checks.make_exec_targets.length.should.equal(2);
      checks.make_exec_targets[0].should.equal('clean');
      checks.make_exec_targets[1].should.equal('lint');
    });

    it('should override type with mode-based property when type is configured in .bob.json custom config', function () {
      bob = new (create(checks, mocks))(
        '/app/bob',
        { lint: { 'default': 'jshint', types: { jshint: { bin: { human: '/usr/local/bin/nodelint', robot: '/x/y/z' } }, nodelint: { 'bin': '/usr/bin/nodelint' } } } },
        {},
        { name: 'someapp', version: '1.2.3' });
      bob.external(['clean', 'lint'], 'robot', true, function () {
      });
      checks.make_file.should.equal('/app/bob/bin/Makefile');
      checks.make_verbose.should.equal(true);
      checks.make_exec_params.lint_bin.should.equal('/x/y/z');
      checks.make_exec_targets.length.should.equal(2);
      checks.make_exec_targets[0].should.equal('clean');
      checks.make_exec_targets[1].should.equal('lint');
    });
  });

  describe('internal', function () {

    it('should use the correct target and pass opts', function () {
      bob = new (create(checks, mocks))('somedir', {}, { foo: 'somecustomvalue' }, { bar: 'somepackagevalue' });
      bob.internal('blah', { targetopt: 'targetvalue' }, function () {});
      checks.exec_opts.targetopt.should.equal('targetvalue');
      checks.exec_opts._bob.custom.foo.should.equal('somecustomvalue');
      checks.exec_opts._bob.pkg.bar.should.equal('somepackagevalue');
      (typeof checks.exec_cb).should.equal('function');
    });

    it('should handle undefined internal opts', function () {
      bob = new (create(checks, mocks))('somedir', {}, { foo: 'somecustomvalue' }, { bar: 'somepackagevalue' });
      bob.internal('blah', undefined, function () {});
      checks.exec_opts._bob.custom.foo.should.equal('somecustomvalue');
      checks.exec_opts._bob.pkg.bar.should.equal('somepackagevalue');
      (typeof checks.exec_cb).should.equal('function');
    });

    it('should set proxy to Bob otps when http_proxy env variable is set', function () {
      mocks.process_env.http_proxy = 'http://someproxy';
      bob = new (create(checks, mocks))('somedir', {}, { foo: 'somecustomvalue' }, { bar: 'somepackagevalue' });
      bob.internal('blah', undefined, function () {});
      checks.exec_opts._bob.proxy.should.equal('http://someproxy');
    });
  });
});
 