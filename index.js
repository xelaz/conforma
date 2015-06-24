"use strict";

var util = require('util'),
  mpath = require('mpath'),
  XRegExp = require('xregexp').XRegExp,
  Promise = require("bluebird"),
  _extend = require('node.extend'),
  _filter = require('./lib/filter'),
  _validator = require('./lib/validator');

function ConformaError(field, msg, value) {
  Error.captureStackTrace(this, this.constructor);

  this.name = this.constructor.name;
  this.message = msg;
  this.field = field;
  this.value = value;
}

var Conforma = function() {
  this._filter = [];
  this._validator = [];
  this._data = {};
  this._required = {};
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
 * @param {string}           key
 * @param {*}                filter
 * @param {object} [options] options
 *
 * @returns {Conforma}
 */
Conforma.prototype.filter = function(key, filter, options) {
  if(!key) {
    return this;
  }

  if(!this._filter[key]) {
    this._filter[key] = [];
  }

  if(typeof filter === 'string' && filter !== '') {
    this._filter[key].push(filter);
  } else if(util.isArray(filter)) {
    this._filter[key].push.apply(this._filter[key], filter);
  } else if(typeof filter === 'function') {
    this._filter[key].push(filter);
  }

  return this;
};

/**
 *
 * @param {string}  field
 * @param {*}       validator
 * @param {object} [options]
 * @returns {Conforma}
 */
Conforma.prototype.validate = function(field, validator, options) {
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
 * @param field
 * @param key
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

    if(vName && _validator[vName]) {
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
  //console.log('BEFORE FILTER: \n', this._data);
  var fieldValue, field;

  for(field in this._filter) {
    fieldValue = mpath.get(field, this._data);

    this._filter[field].forEach(function(filter) {
      if(typeof filter === 'function') {
        fieldValue = filter.call(undefined, fieldValue);
      } else if(_filter[filter]) {
        fieldValue = _filter[filter].call(undefined, fieldValue);
      }
    });

    mpath.set(field, fieldValue, this._data);
  }

  //console.log('AFTER FILTER: \n', this._data);
  return this;
};

/**
 * @param {function} done
 * @returns {Promise}
 */
Conforma.prototype.exec = function(done) {

  this._runFilter();

  var _self = this,
    sync = [],
    field, val;

  for(field in _self._validator) {
    val = mpath.get(field, this._data);

    if(_self._required.hasOwnProperty(field) && !val) {
      sync.push(_validator.required()(field, val));
      continue;
    }

    _self._validator[field].forEach(function(f) {
      sync.push(f.call(_self, field, val));
    });
  }

  return Promise.all(sync).then(function(err) {
    var errors = err || [],
      newErrors = [];

    errors.forEach(function(err) {
      err && newErrors.push(err);
    });

    if(newErrors.length) {
      var nErr = new Error('Conforma Validation Error');

      nErr.errors = newErrors;

      throw nErr;
    } else {
      return _self.getData();
    }
  }).nodeify(done);
};

/**
 * @returns {Conforma}
 */
Conforma.prototype.reset = function() {
  this._data = {};

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

module.exports.ConformaError = ConformaError;
module.exports.conform = conform;