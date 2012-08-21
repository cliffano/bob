var bag = require('bagofholding'),
  sandbox = require('sandboxed-module'),
  should = require('should'),
  checks, mocks,
  make;

describe('make', function () {

  function create(checks, mocks) {
    return sandbox.require('../lib/make', {
      requires: mocks ? mocks.requires : {},
      globals: {}
    });
  }

  beforeEach(function () {
    checks = {};
    mocks = {};
  });

  describe('bar', function () {

    it('should make when bar', function (done) {
    });
  });
});
 