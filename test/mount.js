"use strict";

var assert = require("assert"),
  Conforma = require('../index').Conforma;

describe('Concate Conforma', function() {

  it('set default data then main data', function() {
    var conforma = new Conforma();
    var data = conforma
      .setData({
        name: 'Alexander',
        description: 2,
        address: {
          city: 'Gießen',
          zip: 12345,
          street: null
        }
      })
      .validate('description', 'alpha')
      .validate('address', function(field, value) {
        console.log('ValidateAddress: ', field, value);

        var addressConforma = Conforma(value);
        addressConforma
          .namespace(field)
          .filter('city', 'upperCase')
          .validate('street', 'notEmpty')
          .validate('city', ['required']);

        return addressConforma.mount();
      })
      .exec()
      .then(function(data) {
        assert.ok(false);
      })
      .catch(function(err) {
        console.log('1ERRRR::' , err, '-_---:.-_-.-,----', this.getData());
      });
  });

  it('set default data then main data', function() {
    var conforma = new Conforma();
    var data = conforma
      .setData({
        name: 'Alexander',
        description: 2,
        address: {
          city: 'Gießen',
          zip: 12345,
          street: null
        }
      })
      .validate('description', 'alpha')
      .exec()
      .then(function(data) {
        assert.ok(false);
      })
      .catch(function(err) {
        console.log('2ERRRR::' , err, '-_---:.-_-.-,----', this.getData());
      });
  });

  it('set default data then main data', function() {
    var conforma = new Conforma();
    var data = conforma
      .setData({
        name: 'Alexander',
        description: 'test',
        address: {
          city: 'Gießen',
          zip: 12345,
          street: 'Main Street'
        }
      })
      .validate('description', 'alpha')
      .validate('address', function(field, value) {
        console.log('ValidateAddress: ', field, value);

        var addressConforma = Conforma(value);
        addressConforma
          .namespace(field)
          .filter('city', 'upperCase')
          .validate('street', 'notEmpty')
          .validate('city', ['required']);

        return addressConforma.mount();
      })
      .exec()
      .then(function(data) {
        console.log('DATAS:', data);
      });
  });
});