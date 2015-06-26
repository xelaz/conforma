"use strict";
var XRegExp = require('xregexp').XRegExp,
  ConformaError = require('./error'),
  validator = require('validator');

var ConformaValidator = {

  required: function() {
    return function(field, value) {
      if(!value) {
        return new ConformaError(field, 'Field :path: :value: is required', value);
      }
    };
  },

  /**
   * @param {*} [options]
   *
   * @returns {Function}
   */
  email: function(options) {
    return function(field, value) {
      if(!validator.isEmail(value, options)) {
        return new ConformaError(field, 'email.invalid.format %s', value);
      }
    };
  },

  /**
   * @param {bool} [allowWhitespace]
   *
   * @returns {Function}
   */
  alpha: function(allowWhitespace) {
    console.log('allowWhitespace:', allowWhitespace);

    var regex = allowWhitespace === true ? XRegExp('^\\p{L}+\\s*$') : XRegExp('^\\p{L}+$');

    return function(field, value) {
      if(!regex.test(value)) {
        return new ConformaError(field, 'only.alpha.allowed', value);
      }
    };
  },

  /**
   * @param {bool} [allowWhitespace]
   *
   * @returns {Function}
   */
  alnum: function(allowWhitespace) {
    var regex = allowWhitespace === true ? XRegExp('^\\p{L}+\\s*\\d+$') : XRegExp('^\\p{L}+\\d?$');

    return function(field, value) {
      if(!regex.test(value)) {
        return new ConformaError(field, 'only.alnum.allowed', value);
      }
    };
  },

  /**
   *
   * @returns {Function}
   */
  notEmpty: function() {
    return function(field, value) {
      if(value == '') {
        return new ConformaError(field, 'not.be.empty', value);
      }
    }
  }
};

module.exports = ConformaValidator;