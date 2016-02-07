"use strict";

var assert = require("assert"),
  conforma = require('../index'),
  Conforma = conforma.Conforma;


describe('Conforma.validate msg api', function() {
  it('should add validators', function() {
    var formData = new Conforma();

    return formData.setData({
        value1: 'TEST',
        value2: 'TEST',
        value3: 'TEST',
        value4: 'TEST',
        value7: 'TEST',
        value8: '7766',
        value10: ''
      })
      .validate('value1', 'alpha')
      .validate('value2', ['alpha', 'alnum'])
      .validate('value9', ['alpha', 'alnum'], 'Shared Error Mssage')
      .validate('value3', function(field, value) {
        return new conforma.ConformaValidationError(field, 'message aaa', value);
      })
      .validate('value4',{'alpha': true}, 'Test message')
      .validate('value7', [{'alpha': true, msg: 'Wrong Value'}, {'alpha': true}])
      .validate('value5', ['required', 'notEmpty'])
      .validate('value5',  'alpha', 'Wron second Parameter Message')
      .validate('value5', function(field, value) {
        return new conforma.ConformaValidationError(field, 'message', value);
      }, 'WFT Function Error5')
      .validate('value10', ['required', 'notEmpty', 'alpha'])
      .validate('value8', ['required', 'notEmpty', 'alpha'])
      .validate('value8',  'alpha', 'Wrong second Parameter Message')
      .validate('value8', function(field, value) {
        return new conforma.ConformaValidationError(field, 'message gggg', value);
      }, 'WFT Function Error')
      .exec()
      .catch(function(err) {
        /*assert.equal(2, err.errors.length);
         assert.equal('value3', err.errors[0].field);
         assert.equal('value5', err.errors[1].field);

         done();*/
        //console.log('CCCCCC:', err, err.stack);
      });
  });
});
