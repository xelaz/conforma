"use strict";

var sanitizeHtml = require('sanitize-html'),
  validator = require('validator'),
  url = require('url'),
  moment = require('moment'),
  XRegExp = require('xregexp').XRegExp;

//from underscore.string
var escapeChars = {
    lt: '<',
    gt: '>',
    quot: '"',
    apos: "'",
    amp: '&'
  },
  reversedEscapeChars = {},
  key;

for(key in escapeChars){ reversedEscapeChars[escapeChars[key]] = key; }

/**
 * @typedef {object} ConformaFilter
 */
var ConformaFilter = {

  /**
   * @param {*} value
   * @returns {Number}
   */
  digit: function(value) {
    return ConformaFilter.string(value).replace(/[^\d\.]/g, '');
  },

  /**
   * @param {*} value
   * @returns {Number}
   */
  int: function(value) {
    var int = parseInt(value);

    return isNaN(int) ? 0 : int;
  },

  /**
   * @param {*} value
   * @returns {Number}
   */
  float: function(value) {
    var float = parseFloat(value);

    if(isNaN(float)) {
      return 0;
    } else {
      return float;
    }
  },

  bool: function(value) {
    if (typeof value === 'string') {
      var s = value.toLowerCase().trim();
      return s === 'true' || s === 'yes' || s === 'on' || s === '1';
    } else {
      return value === true || value === 1;
    }
  },

  /**
   * @param {*}       value
   * @param {Boolean} [strip]
   * @returns {String}
   */
  string: function(value, strip) {
    if(strip) {
      return ConformaFilter.stripHtml(validator.toString(value).trim());
    } else {
      return validator.toString(value);
    }
  },

  /**
   * @param value
   * @returns {String}
   */
  trim: function(value) {
    return ConformaFilter.string(value).trim();
  },

  /**
   * @param value
   * @returns {String}
   */
  lowerCase: function(value) {
    return ConformaFilter.string(value).toLowerCase();
  },

  /**
   * @param value
   * @returns {String}
   */
  upperCase: function(value) {
    return ConformaFilter.string(value).toUpperCase();
  },

  /**
   * @param value
   * @returns {String}
   */
  escapeHtml: function(value) {
    return ConformaFilter.string(value).replace(/[&<>"']/g, function(m){ return '&' + reversedEscapeChars[m] + ';'; });
  },

  /**
   * @param {*} value
   * @returns {String}
   */
  addslashes: function(value) {
    return ConformaFilter.string(value).replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
  },

  /**
   * @param {String} value
   * @param {Object} options sanitizeHtml options
   *
   * @returns {String}
   */
  stripHtml: function(value, options) {

    options = Object.assign({
      allowedTags: [],
      allowedAttributes: []
    }, options);

    return sanitizeHtml(ConformaFilter.string(value), options);
  },

  /**
   * @param {*} value
   * @returns {String}
   */
  email: function(value) {
    var regex = XRegExp('[^\\p{L}\\p{N}\.\\-@]');
    return XRegExp.replace(ConformaFilter.string(value).toLowerCase(), regex, '', 'all')
      .replace('googlemail.com', 'gmail.com');
  },

  /**
   * @param {String} value
   * @param {Number} max   - string length
   *
   * @returns {String}
   */
  stringLength: function(value, max) {
    if(!max) {
      return value;
    }

    return ConformaFilter.string(value).substr(0, max);
  },

  /**
   *
   * @param {String} value
   * @param {Object} [options]
   */
  url: function(value, options) {
    var urlObj = url.parse(value);

    if(options && options.allowedFields) {
      var fields = options.allowedFields;

      Object.keys(urlObj).forEach(function(key) {
        if(fields.indexOf(key) < 0) {
          urlObj[key] = null;
        }
      });
    }

    return url.format(urlObj);
  },

  /**
   * @param {String} value
   * @param {String} [format]
   */
  date: function(value, format) {
    if(!value) {
      return value;
    }

    return moment(value, format).toDate();
  },

  /**
   * @param {String}  value
   * @param {Boolean} copy
   *
   * @return {Object}
   */
  object: function(value, copy) {
    if(!(value instanceof Object) || !copy) {
      return copy ? Object(value) : {};
    } else {
      return copy ? Object(value) : {};
    }
  },

  /**
   * @param {String}  value
   * @param {Boolean} copy
   *
   * @return {Array}
   */
  array: function(value, copy) {
    if(!Array.isArray(value)) {
      return copy ? [].concat(value) : [];
    } else {
      return copy ? [].concat(value.slice(0)) : [];
    }
  }
};

module.exports = ConformaFilter;