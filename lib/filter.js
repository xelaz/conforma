"use strict";
var sanitizer = require('sanitizer');

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

var filter = {

  /**
   * @param {*} value
   * @returns {Number}
   */
  int: function(value) {
    var int = parseInt(value);

    if(Number.isNaN(int)) {
      return 0;
    } else {
      return int;
    }
  },

  /**
   * @param {*} value
   * @returns {Number}
   */
  float: function(value) {
    var float = parseFloat(value);

    if(Number.isNaN(float)) {
      return 0;
    } else {
      return float;
    }
  },

  bool: function(value) {
    if (typeof value === 'string') {
      var s = value.toLowerCase();
      return s === 'true' || s === 'yes' || s === 'on' || s === '1';
    } else {
      return value === true || value === 1;
    }
  },

  /**
   * @param value
   * @returns {string}
   */
  string: function(value) {
    return value + '';
  },

  /**
   * @param value
   * @returns {string}
   */
  trim: function(value) {
    return filter.string(value).trim();
  },

  /**
   * @param value
   * @returns {string}
   */
  toLowerCase: function(value) {
    return filter.string(value).toLowerCase();
  },

  /**
   * @param value
   * @returns {string}
   */
  toUpperCase: function(value) {
    return filter.string(value).toUpperCase();
  },

  /**
   * @param value
   * @returns {string}
   */
  escapeHtml: function(value) {
    return filter.string(value).replace(/[&<>"']/g, function(m){ return '&' + reversedEscapeChars[m] + ';'; });
  },

  /**
   * @param value
   * @returns {string}
   */
  stripHtml: function(value) {
    return sanitizer.sanitize(filter.string(value)).replace(/(<([^>]+)>)/ig, '');
  },

  /**
   * @param value
   * @returns {string}
   */
  email: function(value) {
    return sanitizer.sanitize(filter.string(value).toLowerCase()).replace(/a-z0-9_\.-@/g, '');
  }
};

module.exports = filter;