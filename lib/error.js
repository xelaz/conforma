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
};
util.inherits(ConformaError, Error);

/**
 * @param {string} field
 * @param {string} msg
 * @param {*}      value
 *
 * @constructor
 */
function ConformaValidationError(field, msg, value) {
  Error.captureStackTrace(this, this.constructor);

  this.name    = this.constructor.name;
  this.message = msg;
  this.field   = field;
  this.value   = value;
};
util.inherits(ConformaValidationError, Error);

module.exports.ConformaError = ConformaError;
module.exports.ConformaValidationError = ConformaValidationError;