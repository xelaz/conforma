"use strict";

var util = require('util'),
  mpath = require('mpath'),
  Promise = require("bluebird"),
  _extend = require('node.extend'),
  _filter = require('./lib/filter'),
  _validator = require('./lib/validator'),
  ConformaError = require('./lib/error').ConformaError,
  ConformaValidationError = require('./lib/error').ConformaValidationError;

/**
 * @typedef {Conforma} Conforma
 * @class
 * @constructor
 *
 * @param {Object}     [data]
 *
 * @property {Array}   _filter
 * @property {Array}   _validator
 * @property {Array}   _required
 * @property {Object}  _data
 *
 * @returns {Conforma}
 */
var Conforma = function(data) {
  if (!(this instanceof Conforma)){
    return new Conforma(data);
  }

  return this.reset().setData(data);
};

/**
 * @returns {Conforma}
 */
Conforma.prototype.reset = function() {
  /**
   * @type {Array}
   * @private
   */
  this._filter    = [];

  /**
   * @type {Array}
   * @private
   */
  this._validator = [];

  /**
   * @type {Array}
   * @private
   */
  this._required  = [];

  /**
   * @type {Array}
   * @private
   */
  this._empty  = [];

  /**
   * @type {{}}
   * @private
   */
  this._data      = {};

  /**
   *
   * @type {null}
   * @private
   */
  this._namespace = null;

  return this;
};

/**
 * @param {String} srcPath
 * @param {String} [destPath] - if it is empty then move to root node
 *
 * @returns {Conforma}
 */
Conforma.prototype.move = function(srcPath, destPath) {
  var data = mpath.get(srcPath, this._data);
  var tmpData = this._data;

  if(srcPath && destPath && mpath.get(destPath, this._data)) {
    mpath.set(destPath, mpath.get(srcPath, this._data), this._data);
  } else if(srcPath && destPath) {
    var nodePath = destPath.split('.');
    var last = nodePath.pop();

    nodePath.forEach(function(path) {
      tmpData[path] = tmpData[path] || {};
      tmpData = tmpData[path];
    });
    tmpData[last] = data;
  } else if(srcPath && !destPath) {
    _extend(this._data, data);
  }

  return this.remove(srcPath);
};

/**
 * @param srcPath
 *
 * @returns {Conforma}
 */
Conforma.prototype.remove = function(srcPath) {
  var path = srcPath.split('.');
  var last = path.pop();
  var data = this._data;

  path.forEach(function(path) {
    data = data[path];
  });

  delete data[last];

  return this;
};

/**
 * @param {Object} data
 *
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
 * @param {Boolean} [clean] - get clean or raw data
 *
 * @returns {{}|*}
 */
Conforma.prototype.getData = function(clean) {
  if(clean) {
    this._runFilter();
  }

  return _extend(true, {}, this._data);
};

/**
 * @param {String} field - get field value
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
 * @throws Error
 *
 * @returns {Conforma}
 */
Conforma.prototype.conform = function(value) {
  if(!value) {
    throw new Error('conform empty value');
  }

  this._data = conform(this._data, value);

  return this;
};

/**
 *
 * @param {String}              field
 * @param {String|Array|Object} filter
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
 * @param {String}              field
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
 * @param {String} field
 * @param {String} key
 *
 * @private
 */
Conforma.prototype._applyValidator = function (field, key) {
  var func = null, vName;

  if(key === 'required' && !this._required.hasOwnProperty(field)) {
    this._required[field] = true;
  }

  if(key === 'empty' && !this._empty.hasOwnProperty(field)) {
    this._empty[field] = true;
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
  var _this = this;

  for(var field in this._filter) {
    if(this._filter.hasOwnProperty(field)) {
      fieldValue = this.getValue(field);

      this._filter[field].forEach(function (filter) {
        if (typeof filter === 'function') {
          fieldValue = filter.call(_this, fieldValue);
        } else if (typeof filter === 'string' && filter in _filter) {
          fieldValue = _filter[filter].call(_this, fieldValue);
        } else if(typeof filter === 'object') {
          var fName = Object.keys(filter).pop() || null;

          if(fName && fName in _filter) {
            fieldValue = _filter[fName].call(_this, fieldValue, filter[fName]);
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
      var extendedFiled = _self._namespace ? [_self._namespace, field].join('.') : field;

      if(field in _self._required && val === undefined) {
        sync.push(Promise.try(_validator.required(), [extendedFiled, val], _self));
      } else {
        if(field in _self._empty && !val) {
          // do nothing)
        } else {
          _self._validator[field].forEach(function(f) {
            sync.push(Promise.try(f, [extendedFiled, val], _self));
          });
        }
      }
    }
  }

  return Promise.all(sync)
    .bind(_self)
    .then(function(err) {
      var errors = err || [],
        newErrors = [],
        newData =  [],
        normalizedData = [];

      errors.forEach(function(err) {
        if(err instanceof ConformaError) {
          err.errors.forEach(function(data) {
            normalizedData.push(data)
          });
        } else if(err) {
          normalizedData.push(err);
        }
      });

      normalizedData.forEach(function(err) {
        if(err instanceof ConformaError) {
          newErrors = newErrors.concat(err.errors);
        } else if(err instanceof ConformaValidationError) {
          newErrors = newErrors.concat(err);
        } else if(err) {
          newData.push(err);
        }
      });

      if(newData.length) {
        newData.forEach(function(data) {
          _self.setData(data);
        });
      }

      if(newErrors.length) {
        throw new ConformaError('You have an error on validate data', newErrors);
      }

      return _self.getData();
    })
    .nodeify(done && done.bind(_self));
};

/**
 * @return {Promise}
 */
Conforma.prototype.mount = function() {
  var _this = this;
  return this.exec().then(function(data) {
    if(_this._namespace) {
      var o = {};
      // TODO: complexe nestings
      o[_this._namespace] = _this.getData();
      return o;
    } else {
      return _this.getData();
    }
  }).catch(ConformaError, function(err) {

    if(_this._namespace) {
      var o = {};
      o[_this._namespace] = _this.getData();
      err.errors.push(o);
    } else {
      err.errors.push(_this.getData());
    }

    // prevent throwing error
    return err;
  });
};

/**
 * for mount conformas
 *
 * @param namespace
 * @return {Conforma}
 */
Conforma.prototype.namespace = function(namespace) {
  this._namespace = namespace;

  return this;
};

/**
 * @param {*} src
 * @param {*} conf
 *
 * @returns {*}
 */
function conform(src, conf) {
  var dest = {};

  var rec = function(dest, src, conf) {
    Object.keys(conf).forEach(function(key) {
      if((typeof conf[key] === 'object' && !Array.isArray(conf[key]))) {
        dest[key] = rec({}, src[key] || {}, conf[key]);
      } else if(typeof conf[key] === 'object' && Array.isArray(conf[key])) {
        dest[key] = conf[key];
      } else {
        if(Object.prototype.hasOwnProperty.call(src, key)) {
          dest[key] = src[key];
        } else {
          dest[key] = src[key] || conf[key];
        }
      }
    });

    return dest;
  };

  return rec(dest, src, conf);
}

/**
 * @type {Conforma}
 */
module.exports.Conforma = Conforma;

/**
 * @type {ConformaFilter}
 */
module.exports.ConformaFilter = _filter;

/** @type {ConformaError} */
module.exports.ConformaError = ConformaError;

/**
 * @type {ConformaValidationError}
 */
module.exports.ConformaValidationError = ConformaValidationError;

/**
 * @type {function}
 */
module.exports.conform = conform;