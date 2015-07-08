"use strict";
var ConformaError = require('./error'),
  validator = require('validator');

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
    var dns = require('dns'),
      Promise = require('bluebird');

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
          } else if(addresses.length === 0) {
            reject(new Error('MX Record nonexistent'));
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
    var XRegExp = require('xregexp').XRegExp;
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
    var XRegExp = require('xregexp').XRegExp;
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
  },

  /**
   * @param {*} [comparison]
   *
   * @returns {Function}
   */
  equals: function(comparison) {

    return function(field, value) {
      if(value !== comparison) {
        return new ConformaError(field, 'value.is.not.equal', value);
      }
    }
  },

  /**
   * @param {string} [fieldToCompare]
   *
   * @returns {Function}
   */
  compare: function(fieldToCompare) {

    return function(field, value) {
      var compareValue = this.getValue(fieldToCompare);

      if(value !== compareValue) {
        return new ConformaError(field, 'value.is.not.equal', value);
      }
    }
  },

  /**
   * @param {string} [snippet]
   *
   * @returns {Function}
   */
  contains: function(snippet) {

    return function(field, value) {
      if(!validator.contains(value, snippet)) {
        return new ConformaError(field, 'snippet.not.found', value);
      }
    }
  },

  /**
   * @param {string} [format]
   *
   * @returns {Function}
   */
  isDate: function(format) {
    var moment = require('moment');

    return function(field, value) {
      var date = typeof format !== 'undefined' ? moment(value, format) :  moment(Date.parse(value));

      if(!date.isValid()) {
        return new ConformaError(field, 'date.is.invalid', value);
      }
    }
  }
};

module.exports = ConformaValidator;