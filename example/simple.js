"use strict";

var conforma = require('./../index');

var formData = new conforma.Conforma();

formData.setData({
  value1: '123',
  value2: 'yes',
  nested: {
    value1: 'email(at)localhost',
    value2: 'Hänsel und Gretel ',
    value4: 'SOME TRASH'
  },
  trashValue: 'foobar'
}).default({
  value1: 1,
  value3: 'foobar',
  nested: {
    value3: '   <html>Hello World!</html>'
  }
}).conform({
  value1: undefined,
  value2: undefined,
  nested: {
    value1: undefined,
    value2: undefined,
    value3: undefined
  }
})
  .filter('value1', 'int')
  .filter('value2', 'bool')
  .filter('nested.value2', ['trim', 'toUpperCase'])
  .filter('nested.value3', ['string', 'trim', 'escapeHtml'])
  .validate('nested.value1', ['email', 'required'])
  .validate('nested.value2', {alpha: true})
  .exec(function(err, data) {
    err &&  console.log('Error: ', err);

    data && console.log('Data: ', data);
  });