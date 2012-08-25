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
        }
      },
      globals: {
        console: bag.mock.console(checks),
        Date: function () {
          return new Date(2000, 0, 1);
        },
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

  describe('build', function () {

    it('should pass makefile, verbose, constructed params and targets to make', function () {
      bob = new (create(checks, mocks))(
        '/app/bob',
        { lint: { 'default': 'jshint', types: { jshint: { 'bin': '/usr/bin/jshint' } } } },
        {},
        { name: 'someapp', version: '1.2.3' });
      bob.build(['clean', 'lint'], 'robot', true, function () {
      });
      checks.make_file.should.equal('/app/bob/conf/Makefile');
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

    it('should override target when override property exists in custom .bob.json', function () {
      bob = new (create(checks, mocks))(
        '/app/bob',
        { test: { 'default': 'mocha', types: { mocha: { 'bin': '/usr/bin/mocha' } }, overrides: { pkg: { 'test-npm': 'scripts.test' }} } },
        {},
        { name: 'someapp', version: '1.2.3', scripts: { test: 'vows test/' } });
      bob.build(['clean', 'test'], 'robot', true, function () {
      });
      checks.make_file.should.equal('/app/bob/conf/Makefile');
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
      bob.build(['clean', 'lint'], 'robot', true, function () {
      });
      checks.make_file.should.equal('/app/bob/conf/Makefile');
      checks.make_verbose.should.equal(true);
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
      bob.build(['clean', 'lint'], 'robot', true, function () {
      });
      checks.make_file.should.equal('/app/bob/conf/Makefile');
      checks.make_verbose.should.equal(true);
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
      bob.build(['clean', 'lint'], 'robot', true, function () {
      });
      checks.make_file.should.equal('/app/bob/conf/Makefile');
      checks.make_verbose.should.equal(true);
      checks.make_exec_params.lint_bin.should.equal('/x/y/z');
      checks.make_exec_targets.length.should.equal(2);
      checks.make_exec_targets[0].should.equal('clean');
      checks.make_exec_targets[1].should.equal('lint');
    });
  });

  describe('versionUp', function () {

    it('should increment patch number when type is not specified', function () {
      bob = new (create(checks, mocks))('somedir', {}, {}, { version: '5.6.7' });
      bob.versionUp();
      checks.fs_writeFileSync_file.should.equal('/curr/dir/package.json');
      checks.fs_writeFileSync_data.should.equal('{\n  "version": "5.6.8"\n}');
      checks.console_log_messages.length.should.equal(1);
      checks.console_log_messages[0].should.equal('Version upgraded to 5.6.8');
    });

    it('should increment minor number and reset patch number when type is minor', function () {
      bob = new (create(checks, mocks))('somedir', {}, {}, { version: '5.6.7' });
      bob.versionUp('minor');
      checks.fs_writeFileSync_file.should.equal('/curr/dir/package.json');
      checks.fs_writeFileSync_data.should.equal('{\n  "version": "5.7.0"\n}');
      checks.console_log_messages.length.should.equal(1);
      checks.console_log_messages[0].should.equal('Version upgraded to 5.7.0');
    });

    it('should increment major number and reset minor and patch numbers when type is major', function () {
      bob = new (create(checks, mocks))('somedir', {}, {}, { version: '5.6.7' });
      bob.versionUp('major');
      checks.fs_writeFileSync_file.should.equal('/curr/dir/package.json');
      checks.fs_writeFileSync_data.should.equal('{\n  "version": "6.0.0"\n}');
      checks.console_log_messages.length.should.equal(1);
      checks.console_log_messages[0].should.equal('Version upgraded to 6.0.0');
    });

    it('should set version to 0.0.1 when package.json does not contain version and type is default', function () {
      bob = new (create(checks, mocks))('somedir', {}, {}, {});
      bob.versionUp();
      checks.fs_writeFileSync_file.should.equal('/curr/dir/package.json');
      checks.fs_writeFileSync_data.should.equal('{\n  "version": "0.0.1"\n}');
      checks.console_log_messages.length.should.equal(1);
      checks.console_log_messages[0].should.equal('Version upgraded to 0.0.1');
    });
  });

  describe('template', function () {

    it('should not do anything when custom config does not contain template setting', function () {
      bob = new (create(checks, mocks))('somedir', {}, {}, {});
      bob.template();
      should.not.exist(checks.fs_readFileSync_file);
      should.not.exist(checks.fs_writeFileSync_file);
    });

    it('should write applied template to filesystem when template is configured', function () {
      mocks.fs_readFileSync_somefile = 'The date is {now(\'dd-mm-yyyy\')}';
      bob = new (create(checks, mocks))('somedir', {}, { template: ['somefile'] }, {});
      bob.template();
      checks.fs_readFileSync_file.should.equal('somefile');
      checks.fs_readFileSync_encoding.should.equal('utf-8');
      checks.fs_writeFileSync_file.should.equal('somefile');
      checks.fs_writeFileSync_data.should.equal('The date is 01-01-2000');
      checks.fs_writeFileSync_encoding.should.equal('utf-8');
    });
  });
});
 