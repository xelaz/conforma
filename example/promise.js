"use strict";

var conforma = require('./../index');

var formData = new conforma.Conforma();

formData.setData({
  value1: '123',
  value2: 'yes'
})
  .filter('value1', 'int')
  .filter('value2', 'bool')
  .exec()
  .then(function(data) {
    // ...
  })
  .catch(function(error) {
    // ...
  });