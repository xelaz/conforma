"use strict";

var assert = require("assert"),
  Conforma = require('../index').Conforma;

describe('Mount Conforma', function() {

  it('should return errors with namespace name', function() {
    var conforma = new Conforma();
    conforma
      .namespace('user')
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
      .then(function() {
        assert.ok(false);
      })
      .catch(function(err) {
        assert.equal(1, err.errors.length, 'must have 1 errors');
        assert.equal('user.description', err.errors[0].field, 'must contain namespace errors');
      });
  });

  it('should mount conformas and return joint errors', function() {
    var conforma = new Conforma();
    conforma
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
        var addressConforma = Conforma(value);
        return addressConforma
          .namespace(field)
          .filter('city', 'upperCase')
          .validate('street', 'notEmpty')
          .validate('city', ['required'])
          .mount();
      })
      .exec()
      .then(function() {
        assert.ok(false);
      })
      .catch(function(err) {
        assert.equal(2, err.errors.length, 'must have 2 errors');
        var data = this.getData();
        assert.equal('GIESSEN', data.address.city);
      });
  });

  it('should mounted data be filtered', function() {
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
        var addressConforma = Conforma(value);
        addressConforma
          .namespace(field)
          .filter('city', 'upperCase')
          .validate('street', 'notEmpty')
          .validate('city', ['required']);

        return addressConforma.mount();
      })
      .exec()
      .catch(function() {
        assert.ok(false);
      })
      .then(function(data) {
        assert.equal('GIESSEN', data.address.city);
      });
  });
});