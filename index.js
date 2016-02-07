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
   * @type {Object}
   * @private
   */
  this._msg  = {};

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

  if(!this._filter.hasOwnProperty(field)) {
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
 * @param {String|Array|Object} validator
 * @param {Object} [msg]
 *
 * @returns {Conforma}
 */
Conforma.prototype.validate = function(field, validator, msg) {
  if(!field || !validator) {
    return this;
  }

  var _this = this;

  if(!this._validator.hasOwnProperty(field)) {
    this._validator[field] = {};
  }

  if(util.isArray(validator)) {
    validator.forEach(function(key) {
      _this._applyValidator(field, key, msg);
    });
  } else {
    _this._applyValidator(field, validator, msg);
  }

  return this;
};

/**
 * @param {String} field
 * @param {String} key
 * @param {Object} [msg]
 *
 * @private
 */
Conforma.prototype._applyValidator = function (field, key, msg) {
  var vName, func;

  if(typeof key === 'string' && key in _validator) {
    func = _validator[key]();
  } else if(typeof key === 'function') {
    func = key;
    key = '#' + Object.keys(this._validator[field]).length;
  } else if(typeof key === 'object') {

    vName = Object.keys(key)[0] + '' || null;

    if(vName in _validator) {
      func = _validator[vName].call(_validator, key[vName]);
      msg = key.msg || msg;
      key = vName;
    }
  }

  if(func) {
    if(!this._validator[field][key]) {
      this._validator[field][key] = [];
    }

    this._msg[field + key] = msg;
    this._validator[field][key][this._validator[field][key].length] = func;
  }
};

/**
 * @returns {Conforma}
 *
 * @private
 */
Conforma.prototype._runFilter = function() {
  var _this = this;

  Object.keys(this._filter).forEach(function(field) {
    var fieldValue = _this.getValue(field);

    _this._filter[field].forEach(function (filter) {
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

    mpath.set(field, fieldValue, _this._data);
  });

  return this;
};

/**
 * Filter data and validate
 *
 * @param {function} [done] - callback or promise
 *
 * @returns {Promise}
 */
Conforma.prototype.exec = function(done) {
  this._runFilter();

  var _this = this, sync = [];

  Object.keys(this._validator).forEach(function(field) {
    var val = _this.getValue(field);
    var validators = _this._validator[field];
    var extendedField = _this._namespace ? [_this._namespace, field].join('.') : field;

    if('required' in validators && val === undefined) {
      sync[sync.length] = Promise.try(function () {
        return _validator.required()(extendedField, val, _this._msg[field+'required']);
      });
    } else if('notEmpty' in validators && !(val|0)) {
      sync[sync.length] = Promise.try(function () {
        return _validator.notEmpty()(extendedField, val, _this._msg[field+'notEmpty']);
      });
    } else if('empty' in validators) {
      sync[sync.length] = Promise.resolve();
    } else {
      Object.keys(validators).map(function(validator) {
        validators[validator].map(function(v) {
          sync[sync.length] = Promise.try(function () {
            return v.call(_this, extendedField, val, _this._msg[field+validator]);
          });
        });
      });
    }
  });

  return Promise.all(sync)
    .bind(this)
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
          _this.setData(data);
        });
      }

      if(newErrors.length) {
        throw new ConformaError('You have an error on validate data', newErrors);
      }

      return _this.getData();
    })
    .nodeify(done && done.bind(this));
};

/**
 * @return {Promise}
 */
Conforma.prototype.mount = function() {
  var _this = this;
  return this.exec().then(function(data) {
    if(_this._namespace) {
      var o = {};
      // TODO: complex nesting
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

/** @type {Conforma} */
module.exports.Conforma = Conforma;

/** @type {ConformaFilter} */
module.exports.ConformaFilter = _filter;

/** @type {ConformaError} */
module.exports.ConformaError = ConformaError;

/** @type {ConformaValidationError} */
module.exports.ConformaValidationError = ConformaValidationError;

/** @type {function} */
module.exports.conform = conform;