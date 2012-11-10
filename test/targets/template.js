var bag = require('bagofholding'),
  sandbox = require('sandboxed-module'),
  should = require('should'),
  checks, mocks,
  template;

describe('template', function () {

  function create(checks, mocks) {
    return sandbox.require('../../lib/targets/template', {
      requires: {
        fs: bag.mock.fs(checks, mocks)
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

    it('should not do anything when custom config does not contain template setting', function () {
      template = create(checks, mocks);
      template.exec({ _bob: { custom: {}, pkg: {}}});
      should.not.exist(checks.fs_readFileSync_file);
      should.not.exist(checks.fs_writeFileSync_file);
    });

    it('should write applied template to filesystem when template is configured', function () {
      mocks.fs_readFileSync_somefile = 'The date is {now(\'dd-mm-yyyy\')}. The version is {version} .';
      template = create(checks, mocks);
      template.exec({ _bob: { custom: { template: ['somefile'] }, pkg: { version: '1.2.3' }}});
      checks.fs_readFileSync_file.should.equal('somefile');
      checks.fs_readFileSync_encoding.should.equal('utf-8');
      checks.fs_writeFileSync_file.should.equal('somefile');
      checks.fs_writeFileSync_data.should.equal('The date is 01-01-2000. The version is 1.2.3 .');
      checks.fs_writeFileSync_encoding.should.equal('utf-8');
    });
  });
});
 