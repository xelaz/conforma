"use strict";

/**
 * @param {string} field
 * @param {string} msg
 * @param {string|number|bool} value
 *
 * @constructor
 */
function ConformaError(field, msg, value) {
  Error.captureStackTrace(this, this.constructor);

  this.name = this.constructor.name;
  this.message = msg;
  this.field = field;
  this.value = value;
}

module.exports = ConformaError;