"use strict";
var XRegExp = require('xregexp').XRegExp,
  ConformaError = require('./error'),
  validator = require('validator'),
  Promise = require('bluebird');

var ConformaValidator = {

  required: function() {
    return function(field, value) {
      if(value === undefined) {
        return new ConformaError(field, 'field.is.required', value);
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
        return new ConformaError(field, 'email.invalid.format', value);
      }
    };
  },

  /**
   * @returns {Function}
   */
  emailMx: function() {
    var dns = require('dns');

    var emailCheck = ConformaValidator.email();

    return function(field, value) {
      var validEmailError = emailCheck(field, value);

      if(validEmailError) {
        return validEmailError
      }

      var host = value.replace(/^.*@/, '');

      return new Promise(function(fulfill, reject) {
        dns.resolveMx(host, function(err, addresses) {
          if (err) {
            reject(err);
          } else {
            fulfill();
          }
        })
      })
        .catch(function() {
          return new ConformaError(field, 'email.not.resolved', value);
        });
    };
  },

  /**
   * @param {bool} [allowWhitespace]
   *
   * @returns {Function}
   */
  alpha: function(allowWhitespace) {
    var regex = allowWhitespace === true ? XRegExp('[^\\p{L}\\s]') : XRegExp('[^\\p{L}]');

    return function(field, value) {
      if(regex.test(value)) {
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
    var regex = allowWhitespace === true ? XRegExp('[^\\p{L}\\p{N}\\s]') : XRegExp('[^\\p{L}\\p{N}]');

    return function(field, value) {
      if(regex.test(value)) {
        return new ConformaError(field, 'only.alnum.allowed', value);
      }
    };
  },

  /**
   * @returns {Function}
   */
  notEmpty: function() {
    return function(field, value) {
      if(value === '') {
        return new ConformaError(field, 'not.be.empty', value);
      }
    }
  }
};

module.exports = ConformaValidator;