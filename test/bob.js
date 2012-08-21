var bag = require('bagofholding'),
  _jscov = require('../lib/bob'),
  sandbox = require('sandboxed-module'),
  should = require('should'),
  checks, mocks,
  bob;

describe('bob', function () {

  function create(checks, mocks) {
    return sandbox.require('../lib/bob', {
      requires: mocks ? mocks.requires : {},
      globals: {}
    });
  }

  beforeEach(function () {
    checks = {};
    mocks = {};
  });

  describe('bar', function () {

    it('should bob when bar', function (done) {
    });
  });
});
 