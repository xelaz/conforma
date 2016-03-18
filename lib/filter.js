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
   * @returns {string}
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
   * @returns {string}
   */
  trim: function(value) {
    return ConformaFilter.string(value).trim();
  },

  /**
   * @param value
   * @returns {string}
   */
  lowerCase: function(value) {
    return ConformaFilter.string(value).toLowerCase();
  },

  /**
   * @param value
   * @returns {string}
   */
  upperCase: function(value) {
    return ConformaFilter.string(value).toUpperCase();
  },

  /**
   * @param value
   * @returns {string}
   */
  escapeHtml: function(value) {
    return ConformaFilter.string(value).replace(/[&<>"']/g, function(m){ return '&' + reversedEscapeChars[m] + ';'; });
  },

  /**
   * @param value
   * @returns {string}
   */
  addslashes: function(value) {
    return ConformaFilter.string(value).replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
  },

  /**
   * @param {String} value
   * @param {Object} options sanitizeHtml options
   *
   * @returns {string}
   */
  stripHtml: function(value, options) {

    options = Object.assign({
      allowedTags: [],
      allowedAttributes: []
    }, options);

    return sanitizeHtml(ConformaFilter.string(value), options);
  },

  /**
   * @param value
   * @returns {string}
   */
  email: function(value) {
    var regex = XRegExp('[^\\p{L}\\p{N}\.\\-@]');
    return XRegExp.replace(ConformaFilter.string(value).toLowerCase(), regex, '', 'all')
      .replace('googlemail.com', 'gmail.com');
  },

  /**
   * @param {string} value
   * @param {number} max   - string length
   *
   * @returns {string}
   */
  stringLength: function(value, max) {
    if(!max) {
      return value;
    }

    return ConformaFilter.string(value).substr(0, max);
  },

  /**
   *
   * @param {string} value
   * @param {object} [options]
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
   * @param {string} value
   * @param {string} [format]
   */
  date: function(value, format) {
    if(!value) {
      return value;
    }

    return moment(value, format).toDate();
  },

  /**
   * @param {string} value
   */
  object: function(value) {
    if(!(value instanceof Object)) {
      return Object(value);
    } else {
      return {};
    }
  },

  /**
   * @param {string} value
   */
  array: function(value) {
    if(!Array.isArray(value)) {
      return [].concat(value);
    } else {
      return [];
    }
  }
};

module.exports = ConformaFilter;