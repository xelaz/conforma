"use strict";
var XRegExp = require('xregexp').XRegExp,
  ConformaError = require('./error');

var validator = {

  required: function() {
    return function(field, value) {
      if(!value) {
        return new ConformaError(field, 'Field :path: :value: is required', value);
      }
    };
  },

  email: function() {
    var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return function(field, value) {
      if(!regex.test(value)) {
        return new ConformaError(field, 'email.invalid.format %s', value);
      }
    };
  },

  /**
   * @param {bool} [options]
   *
   * @returns {Function}
   */
  alpha: function(options) {
    var regex = options === true ? XRegExp('^\\p{L}+\\s?\\p{L}+$') : XRegExp('^\\p{L}+$');

    return function(field, value) {
      if(!regex.test(value)) {
        return new ConformaError(field, 'only.alpha.allowed', value);
      }
    };
  },

  alnum: function(options) {
    var regex = options === true ? XRegExp('^\\p{L}+\\s?\\d?$') : XRegExp('^\\p{L}+\\d?$');

    return function(field, value) {
      if(!regex.test(value)) {
        return new ConformaError(field, 'only.alnum.allowed', value);
      }
    };
  }
};

module.exports = validator;