"use strict";

var util = require('util'),
  mpath = require('mpath'),
  Promise = require("bluebird"),
  _extend = require('node.extend'),
  _filter = require('./lib/filter'),
  _validator = require('./lib/validator'),
  ConformaError = require('./lib/error').ConformaError,
  ConformaValidationError = require('./lib/error').ConformaValidationError;

var Conforma = function(data) {
  this._filter    = [];
  this._validator = [];
  this._required  = [];
  this._data      = {};

  this.setData(data);
};

/**
 * @param {object} data
 * @returns {Conforma}
 */
Conforma.prototype.setData = function(data) {
  this._data = _extend(true, this._data, data || {});

  return this;
};

/**
 * without start exec you get can get filtered or raw data,
 * after exec you get only filtered data
 *
 * @param {bool} [clean] - get clean or raw data
 *
 * @returns {{}|*}
 */
Conforma.prototype.getData = function(clean) {
  if(clean) {
    this._runFilter();
  }

  return this._data;
};

/**
 * @param {string} field - get field value
 *
 * @returns {*|undefined}
 */
Conforma.prototype.getValue = function(field) {
  return mpath.get(field, this._data);
};

/**
 * @param {*} value
 *
 * @returns {Conforma}
 */
Conforma.prototype.default = function(value) {
  this._data = _extend(true, value, this._data);

  return this;
};

/**
 * @param {*} value
 *
 * @returns {Conforma}
 */
Conforma.prototype.conform = function(value) {
  this._data = conform(value, this._data);

  return this;
};

/**
 *
 * @param {string}              field
 * @param {string|array|object} filter
 *
 * @returns {Conforma}
 */
Conforma.prototype.filter = function(field, filter) {
  if(!field || !filter) {
    return this;
  }

  if(!this._filter[field]) {
    this._filter[field] = [];
  }

  if(typeof filter === 'string' && filter !== '') {
    this._filter[field].push(filter);
  } else if(util.isArray(filter)) {
    this._filter[field].push.apply(this._filter[field], filter);
  } else if(typeof filter === 'function') {
    this._filter[field].push(filter);
  } else if(typeof filter === 'object') {
    this._filter[field].push(filter);
  }

  return this;
};

/**
 * @param {string}              field
 * @param {string|array|object} validator
 *
 * @returns {Conforma}
 */
Conforma.prototype.validate = function(field, validator) {
  if(!field || !validator) {
    return this;
  }

  var _self = this;

  if(!this._validator[field]) {
    this._validator[field] = [];
  }

  if(util.isArray(validator)) {
    validator.forEach(function(key) {
      _self._applyValidator(field, key);
    });
  } else {
    _self._applyValidator(field, validator);
  }

  return this;
};

/**
 *
 * @param {string} field
 * @param {string} key
 *
 * @private
 */
Conforma.prototype._applyValidator = function (field, key) {
  var func = null, vName;

  if(key === 'required' && !this._required.hasOwnProperty(field)) {
    this._required[field] = true;
  }

  if(typeof key === 'string') {
    func = _validator[key] && _validator[key]();
  } else if(typeof key === 'function') {
    func = key;
  } else if(typeof key === 'object') {
    vName = Object.keys(key).pop() || null;

    if(vName && vName in _validator) {
      func = _validator[vName].call(_validator, key[vName]);
    }
  }

  if(func && key !== 'required') {
    this._validator[field].push(func);
  }
};

/**
 * @returns {Conforma}
 *
 * @private
 */
Conforma.prototype._runFilter = function() {
  var fieldValue;

  for(var field in this._filter) {
    if(this._filter.hasOwnProperty(field)) {
      fieldValue = this.getValue(field);

      this._filter[field].forEach(function (filter) {
        if (typeof filter === 'function') {
          fieldValue = filter.call(_filter, fieldValue);
        } else if (typeof filter === 'string' && filter in _filter) {
          fieldValue = _filter[filter].call(_filter, fieldValue);
        } else if(typeof filter === 'object') {
          var fName = Object.keys(filter).pop() || null;

          if(fName && fName in _filter) {
            fieldValue = _filter[fName].call(_filter, fieldValue, filter[fName]);
          }
        }
      });

      mpath.set(field, fieldValue, this._data);
    }
  }

  return this;
};

/**
 * @param {function} [done] - callback or promise
 *
 * @returns {Promise}
 */
Conforma.prototype.exec = function(done) {
  this._runFilter();

  var _self = this, sync = [], val;

  for(var field in this._validator) {
    if(this._validator.hasOwnProperty(field)) {
      val = this.getValue(field);

      if(field in _self._required && val === undefined) {
        sync.push(Promise.try(_validator.required(), [field, val], _self));
      } else {
        _self._validator[field].forEach(function(f) {
          sync.push(Promise.try(f, [field, val], _self));
        });
      }
    }
  }

  return Promise.all(sync).then(function(err) {
    var errors = err || [],
      newErrors = [];

    errors.forEach(function(err) {
      err && newErrors.push(err);
    });

    if(newErrors.length) {
      throw new ConformaError('You have an error on validate data', newErrors);
    } else {
      return _self.getData();
    }
  }).nodeify(done);
};

/**
 * @returns {Conforma}
 */
Conforma.prototype.reset = function() {
  this._filter    = [];
  this._validator = [];
  this._required  = [];
  this._data      = {};

  return this;
};

/**
 * @param {*} needed
 * @param {*} obj
 *
 * @returns {*}
 */
function conform(needed, obj) {
  Object.keys(needed).forEach(function(key) {
    var v = obj.hasOwnProperty(key) ? obj[key] : false;

    if(typeof v === 'function' || (v && typeof v === 'object')) {
      needed[key] = conform(needed[key], obj[key]);
    } else if(v !== false) {
      needed[key] = v;
    }
  });
  return needed;
}

module.exports.Conforma = Conforma;
module.exports.ConformaFilter = _filter;

/** @type {ConformaError} */
module.exports.ConformaError = ConformaError;
module.exports.ConformaValidationError = ConformaValidationError;
module.exports.conform = conform;