"use strict";

var conforma = require('./../index');

var formData = new conforma.Conforma();

formData.setData({
  value1: '123',
  value2: 'test'
})
  .filter('value1', 'int')
  .filter('value2', function(value) {
    return value.toUpperCase();
  })
  .validate('value1', function(field, value) {
    if(value > 100 && value < 200) {
      return new conforma.ConformaError(field, 'My individual error', value);
    }
  })
  .exec(function(err, data) {
    err &&  console.log('Error: ', err);

    data && console.log('Data: ', data);
  });