var should = require('should'),
  sinon = require('sinon'),
  sinonmocha = require('sinon-mocha'),
  template = require('../../lib/targets/template'),
  fs = require('fs'), mockFs;

sinonmocha.enhance(sinon);
sinon.useFakeTimers(new Date(2000, 0, 1).getTime());

describe('template', function () {

  describe('exec', function () {

    beforeEach(function () {
      mockFs = sinon.mock(fs);
    });

    afterEach(function () {
      mockFs.verify();
    });

    it('should not do anything when custom config does not contain template setting', function (done) {

      mockFs.expects('readFileSync').never();

      template.exec({ _bob: { custom: {}, pkg: {}}}, function (err, result) {
        done();
      });
    });

    it('should write applied template to filesystem when template is configured', function () {
    
      var cb = function (err) {};

      mockFs
        .expects('readFileSync')
        .once()
        .withArgs('somefile', 'utf-8')
        .returns('The date is {now(\'dd-mm-yyyy\')}. The version is {version} .');
      
      mockFs
        .expects('writeFile')
        .once()
        .withArgs('somefile', 'The date is 01-01-2000. The version is 1.2.3 .', cb);

      template.exec({ _bob: { custom: { template: ['somefile'] }, pkg: { version: '1.2.3' }}}, cb);
    });

    it('should write applied template to filesystem when there are multiple templates', function () {
    
      var cb = function (err) {};

      mockFs
        .expects('readFileSync')
        .once()
        .withArgs('somefile', 'utf-8')
        .returns('The date is {now(\'dd-mm-yyyy\')}. The version is {version} .');

      mockFs
        .expects('readFileSync')
        .once()
        .withArgs('otherfile', 'utf-8')
        .returns('Hello World');

      mockFs
        .expects('writeFile')
        .once()
        .withArgs('somefile', 'The date is 01-01-2000. The version is 1.2.3 .', cb);

      mockFs
        .expects('writeFile')
        .once()
        .withArgs('otherfile', 'Hello World', cb);

      template.exec({ _bob: { custom: { template: ['somefile', 'otherfile'] }, pkg: { version: '1.2.3' }}}, cb);
    });
  });
}); 