"use strict";
var _error = require('./error'),
  validator = require('validator'),
  moment = require('moment');

var ConformaValidator = {

  required: function() {

    return function(field, value) {
      if(value === undefined) {
        return new _error.ConformaValidationError(field, 'field.is.required', value);
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
        return new _error.ConformaValidationError(field, 'email.invalid.format', value);
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
          return new _error.ConformaValidationError(field, 'email.not.resolved', value);
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
      if(typeof value !== 'string' || regex.test(value)) {
        return  new _error.ConformaValidationError(field, 'only.alpha.allowed.in.value', value);
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
      if(typeof value !== 'string' || regex.test(value)) {
        return new _error.ConformaValidationError(field, 'only.alnum.allowed.in.value', value);
      }
    };
  },

  /**
   * @returns {Function}
   */
  notEmpty: function() {

    return function(field, value) {
      if(value === '') {
        return new _error.ConformaValidationError(field, 'value.can.not.be.empty', value);
      }
      if(value === null) {
        return new _error.ConformaValidationError(field, 'value.can.not.be.empty', value);
      }
      if(Array.isArray(value) && !value.length) {
        return new _error.ConformaValidationError(field, 'value.can.not.be.empty', value);
      }
      if(value === '0') {
        return new _error.ConformaValidationError(field, 'value.can.not.be.empty', value);
      }
      if(value === 0) {
        return new _error.ConformaValidationError(field, 'value.can.not.be.empty', value);
      }
      if(value === false) {
        return new _error.ConformaValidationError(field, 'value.can.not.be.empty', value);
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
        return new _error.ConformaValidationError(field, 'value.is.not.equal.to.comparison', value);
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
        return new _error.ConformaValidationError(field, 'value.is.not.equal.to.other', value);
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
        return new _error.ConformaValidationError(field, 'snippet.not.found.in.value', value);
      }
    }
  },

  /**
   * @param {string} [format]
   *
   * @returns {Function}
   */
  isDate: function(format) {

    return function(field, value) {
      var date;
      if(value instanceof Date) {
        date = moment(value);
      } else if(typeof format !== 'undefined') {
        date = moment(value, format);
      } else {
        date = moment(Date.parse(value));
      }

      if(!date.isValid()) {
        return new _error.ConformaValidationError(field, 'date.is.invalid', value);
      }
    }
  },

  /**
   * @param {array} [list]
   *
   * @returns {Function}
   */
  inList: function(list) {
    list = Array.isArray(list) ? list : [];

    return function(field, value) {
      if(list.indexOf(value) < 0) {
        return new _error.ConformaValidationError(field, 'value.not.in.list', value);
      }
    }
  },

  /**
   * @param {object} [options]
   * @param {number} options.min
   * @param {number} options.max
   *
   * @returns {Function}
   */
  length: function(options) {
    options = options || {};
    var min = parseInt(options.min || 0);
    var max = options.max || undefined;

    return function(field, value) {
      value = '' + value;
      var length = value.length;

      if(length < min) {
        return new _error.ConformaValidationError(field, 'value.is.less.than.min', value, min, max);
      }

      if(max !== undefined && max < length) {
        return new _error.ConformaValidationError(field, 'value.is.more.than.max', value, min, max);
      }
    }
  }
};

module.exports = ConformaValidator;