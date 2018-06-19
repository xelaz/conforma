"use strict";
var _error = require('./error'),
  validator = require('validator'),
  moment = require('moment'),
  XRegExp = require('xregexp'),
  dns = require('dns'),
  Promise = require('bluebird');

var ConformaValidator = {

  required: function () {
    return function (field, value, msg) {
      if (value === undefined) {
        return new _error.ConformaValidationError(field, msg || 'field.is.required', value);
      }
    };
  },

  empty: function () { return function () {} },

  /**
   * @returns {Boolean}
   */
  isEmpty: function (value) {
    var check = false;

    if (Array.isArray(value) && !value.length) {
      check = true;
    } else if (value instanceof Date) {
      check = false;
    } else if (value instanceof Object && !(value instanceof Function) && !Object.keys(value).length) {
      check = true;
    } else {
      var equal = [undefined, '', null, [], '0', 0, false];

      for (var i = 0, l = equal.length; i < l; i++) {
        if (check = (equal[i] === value)) break;
      }
    }

    return check;
  },

  /**
   * @returns {Function}
   */
  notEmpty: function () {
    var isEmpty = this.isEmpty;

    return function (field, value, msg) {
      return isEmpty(value) && new _error.ConformaValidationError(field, msg || 'value.can.not.be.empty', value) || undefined;
    }
  },

  /**
   * @param {*} [options]
   *
   * @returns {Function}
   */
  email: function (options) {
    return function (field, value, msg) {
      if (!validator.isEmail(value, options)) {
        return new _error.ConformaValidationError(field, msg || 'email.invalid.format', value);
      }
    };
  },

  /**
   * @returns {Function}
   */
  emailMx: function () {
    var emailCheck = ConformaValidator.email();

    return function (field, value, msg) {
      var validEmailError = emailCheck(field, value, msg);

      if (validEmailError instanceof _error.ConformaValidationError) {
        return validEmailError;
      }

      var host = value.replace(/^.*@/, '');

      return new Promise(function (fulfill, reject) {
        dns.resolveMx(host, function (err, addresses) {
          if (err) {
            reject(err);
          } else if (addresses.length === 0) {
            reject(new Error('MX Record nonexistent'));
          } else {
            fulfill();
          }
        });
      })
        .catch(function () {
          return new _error.ConformaValidationError(field, msg || 'email.not.resolved', value);
        });
    };
  },

  /**
   * @param {bool} [allowWhitespace]
   *
   * @returns {Function}
   */
  alpha: function (allowWhitespace) {
    var regex = allowWhitespace === true ? XRegExp('[^\\p{L}\\s]') : XRegExp('[^\\p{L}]');

    return function (field, value, msg) {
      if (typeof value !== 'string' || regex.test(value)) {
        return new _error.ConformaValidationError(field, msg || 'only.alpha.allowed.in.value', value);
      }
    };
  },

  /**
   * @param {bool} [allowWhitespace]
   *
   * @returns {Function}
   */
  alnum: function (allowWhitespace) {
    var regex = allowWhitespace === true ? XRegExp('[^\\p{L}\\p{N}\\s]') : XRegExp('[^\\p{L}\\p{N}]');

    return function (field, value, msg) {
      if (typeof value !== 'string' || regex.test(value)) {
        return new _error.ConformaValidationError(field, msg || 'only.alnum.allowed.in.value', value);
      }
    };
  },

  /**
   * @returns {Function}
   */
  number: function () {
    var regex = XRegExp('[^\\p{N}\\.,]');

    return function (field, value, msg) {
      if (regex.test(value)) {
        return new _error.ConformaValidationError(field, msg || 'only.numbers.allowed.in.value', value);
      }
    };
  },

  /**
   * @param {*} [comparison]
   *
   * @returns {Function}
   */
  equals: function (comparison) {
    return function (field, value, msg) {
      if (value !== comparison) {
        return new _error.ConformaValidationError(field, msg || 'value.is.not.equal.to.comparison', value);
      }
    }
  },

  /**
   * @param {string} [fieldToCompare]
   *
   * @returns {Function}
   */
  compare: function (fieldToCompare) {
    return function (field, value, msg) {
      var compareValue = this.getValue(fieldToCompare);

      if (value !== compareValue) {
        return new _error.ConformaValidationError(field, msg || 'value.is.not.equal.to.other', value);
      }
    }
  },

  /**
   * @param {string} [snippet]
   *
   * @returns {Function}
   */
  contains: function (snippet) {
    return function (field, value, msg) {
      if (!validator.contains(value, snippet)) {
        return new _error.ConformaValidationError(field, msg || 'snippet.not.found.in.value', value);
      }
    }
  },

  /**
   * @param {string} [format]
   *
   * @returns {Function}
   */
  isDate: function (format) {
    return function (field, value, msg) {
      var date;
      if (value instanceof Date) {
        date = moment(value);
      } else if (typeof format !== 'undefined') {
        date = moment(value, format);
      } else {
        date = moment(Date.parse(value));
      }

      if (!date.isValid()) {
        return new _error.ConformaValidationError(field, msg || 'date.is.invalid', value);
      }
    }
  },

  /**
   * @param {array} [list]
   *
   * @returns {Function}
   */
  inList: function (list) {
    list = [].concat(list);

    return function (field, value, msg) {
      if (list.indexOf(value) < 0) {
        return new _error.ConformaValidationError(field, msg || 'value.not.in.list', value);
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
  length: function (options) {
    options = options || {};
    var min = parseInt(options.min || 0);
    var max = options.max || undefined;

    return function (field, value, msg) {
      value = '' + value;
      var length = value.length;

      if (length < min) {
        return new _error.ConformaValidationError(field, msg || 'value.is.less.than.min', value, min, max);
      }

      if (max !== undefined && max < length) {
        return new _error.ConformaValidationError(field, msg || 'value.is.more.than.max', value, min, max);
      }
    }
  },

  objectId: function () {
    // Regular expression that checks for hex value
    var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");

    return function (filed, value, msg) {
      if (!checkForHexRegExp.test(value)) {
        return new _error.ConformaValidationError(filed, msg || 'value.not.valid.object.id', value);
      }
    }
  }
};

module.exports = ConformaValidator;