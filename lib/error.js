"use strict";
var util = require('util');

/**
 * @param {string} msg
 * @param {array}  errors
 *
 * @constructor
 */
function ConformaError(msg, errors) {
  Error.captureStackTrace(this, this.constructor);

  this.name = this.constructor.name;
  this.message = msg;
  this.errors  = errors || [];
}
util.inherits(ConformaError, Error);

/**
 * @param {string} field
 * @param {string} msg
 * @param {*}      [value]
 * @param {number} [min]
 * @param {number} [max]
 *
 * @constructor
 */
function ConformaValidationError(field, msg, value, min, max) {
  Error.captureStackTrace(this, this.constructor);

  this.name    = this.constructor.name;
  this.message = msg;
  this.field   = field;
  this.value   = value;

  if(min) {
    this.min = min;
  }

  if(max) {
    this.max = max;
  }
}
util.inherits(ConformaValidationError, Error);

module.exports.ConformaError = ConformaError;
module.exports.ConformaValidationError = ConformaValidationError;