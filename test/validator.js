
"use strict";

var assert = require("assert"),
  Conforma = require('../index').Conforma;

describe('Filter', function() {

  describe('alpha', function() {

    it('should disallowed whitespaces', function(done) {
      var conforma = new Conforma();
      var filtered = conforma.setData({
        value1: 'testäöü',
        value2: 'test me äöü'
      })
        .validate('value1', 'alpha')
        .exec()
        .then(function(data) {
          assert.equal(undefined, data);
        })
        .catch(function(err) {

          console.log(err);

          done();

          //assert.equal(undefined);
        });
    });
  });
});