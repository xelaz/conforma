"use strict";

var assert = require("assert"),
  conforma = require('../index'),
  Conforma = conforma.Conforma;

describe('Conforma.validate', function() {
  it('should add validators', function(done) {
    var formData = new Conforma();
    formData.setData({
      value1: 'TEST',
      value2: 'TEST',
      value3: 'TEST',
      value4: 'TEST'
    })
      .validate('value1', 'alpha')
      .validate('value2', ['alpha', 'alnum'])
      .validate('value3', function(field, value) {
        return new conforma.ConformaError(field, 'message', value);
      })
      .validate('value4', 'unknown')
      .validate('value5', ['required', 'notEmpty'])
      .exec()
      .catch(function(err) {
        assert.equal(2, err.errors.length);
        assert.equal('value3', err.errors[0].field);
        assert.equal('value5', err.errors[1].field);

        done();
      });
  });
});
