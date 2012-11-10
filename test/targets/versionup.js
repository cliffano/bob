var bag = require('bagofholding'),
  sandbox = require('sandboxed-module'),
  should = require('should'),
  checks, mocks,
  versionup;

describe('versionup', function () {

  function create(checks, mocks) {
    return sandbox.require('../../lib/targets/versionup', {
      requires: {
        fs: bag.mock.fs(checks, mocks)
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

    it('should increment patch number when type is not specified', function () {
      versionup = create(checks, mocks);
      versionup.exec({ _bob: { pkg: { version: '5.6.7' }}});
      checks.fs_writeFileSync_file.should.equal('/curr/dir/package.json');
      checks.fs_writeFileSync_data.should.equal('{\n  "version": "5.6.8"\n}');
      checks.console_log_messages.length.should.equal(1);
      checks.console_log_messages[0].should.equal('Version upgraded to 5.6.8');
    });

    it('should increment minor number and reset patch number when type is minor', function () {
      versionup = create(checks, mocks);
      versionup.exec({ type: 'minor', _bob: { pkg: { version: '5.6.7' }}});
      checks.fs_writeFileSync_file.should.equal('/curr/dir/package.json');
      checks.fs_writeFileSync_data.should.equal('{\n  "version": "5.7.0"\n}');
      checks.console_log_messages.length.should.equal(1);
      checks.console_log_messages[0].should.equal('Version upgraded to 5.7.0');
    });

    it('should increment major number and reset minor and patch numbers when type is major', function () {
      versionup = create(checks, mocks);
      versionup.exec({ type: 'major', _bob: { pkg: { version: '5.6.7' }}});
      checks.fs_writeFileSync_file.should.equal('/curr/dir/package.json');
      checks.fs_writeFileSync_data.should.equal('{\n  "version": "6.0.0"\n}');
      checks.console_log_messages.length.should.equal(1);
      checks.console_log_messages[0].should.equal('Version upgraded to 6.0.0');
    });

    it('should set version to 0.0.1 when package.json does not contain version and type is default', function () {
      versionup = create(checks, mocks);
      versionup.exec({ _bob: { pkg: {}}});
      checks.fs_writeFileSync_file.should.equal('/curr/dir/package.json');
      checks.fs_writeFileSync_data.should.equal('{\n  "version": "0.0.1"\n}');
      checks.console_log_messages.length.should.equal(1);
      checks.console_log_messages[0].should.equal('Version upgraded to 0.0.1');
    });
  });
});
 