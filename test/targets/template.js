var bag = require('bagofholding'),
  sandbox = require('sandboxed-module'),
  should = require('should'),
  checks, mocks,
  template;

describe('template', function () {

  function create(checks, mocks) {
    return sandbox.require('../../lib/targets/template', {
      requires: {
        fs: {
          readFileSync: function (file, encoding) {
            checks.fs_readFileSync_file = file;
            checks.fs_readFileSync_encoding = encoding;
            return mocks.fs_readFileSync_somefile;
          },
          writeFile: function (file, data, cb) {
            checks.fs_writeFile_file = file;
            checks.fs_writeFile_data = data;
            cb(mocks.fs_writeFile_error);
          }
        }
      },
      globals: {
        console: bag.mock.console(checks),
        process: bag.mock.process(checks, mocks),
        Date: function () {
          return new Date(2000, 0, 1);
        }
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

    it('should not do anything when custom config does not contain template setting', function (done) {
      template = create(checks, mocks);
      template.exec({ _bob: { custom: {}, pkg: {}}}, function (err, result) {
        done();
      });
      should.not.exist(checks.fs_readFileSync_file);
      should.not.exist(checks.fs_writeFile_file);
    });

    it('should write applied template to filesystem when template is configured', function (done) {
      mocks.fs_readFileSync_somefile = 'The date is {now(\'dd-mm-yyyy\')}. The version is {version} .';
      template = create(checks, mocks);
      template.exec({ _bob: { custom: { template: ['somefile'] }, pkg: { version: '1.2.3' }}}, function (err) {
        done();
      });
      checks.fs_readFileSync_file.should.equal('somefile');
      checks.fs_readFileSync_encoding.should.equal('utf-8');
      checks.fs_writeFile_file.should.equal('somefile');
      checks.fs_writeFile_data.should.equal('The date is 01-01-2000. The version is 1.2.3 .');
    });

    it('should pass error to callback when an error occured while writing a file', function (done) {
      mocks.fs_writeFile_error = new Error('Some write error');
      mocks.fs_readFileSync_somefile = 'The date is {now(\'dd-mm-yyyy\')}. The version is {version} .';
      template = create(checks, mocks);
      template.exec({ _bob: { custom: { template: ['somefile'] }, pkg: { version: '1.2.3' }}}, function (err) {
        checks.console_error_messages.push(err.message);
        done();
      });
      checks.console_error_messages.length.should.equal(1);
      checks.console_error_messages[0].should.equal('Some write error');
    });
  });
});
 