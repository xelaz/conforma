"use strict";

var assert = require("assert"),
  conforma = require('../index'),
  Conforma = conforma.Conforma;

describe('Conforma.validate args check', function() {
  it('should add validators', function(done) {
    var formData = new Conforma();
    formData.setData({
      value1: 'TEST',
      value2: 'TEST',
      value3: 'TEST',
      value4: 'TEST'
    })
      .validate('value1', 'alpha')
      .validate('value2', ['alpha', 'alnum'])
      .validate('value3', function(field, value) {
        return new conforma.ConformaValidationError(field, 'message', value);
      })
      .validate('value4', 'unknown')
      .validate('value5', ['required', 'notEmpty'])
      .exec()
      .catch(function(err) {
        assert.equal(2, err.errors.length);
        assert.equal('value3', err.errors[0].field);
        assert.equal('value5', err.errors[1].field);

        done();
      });
  });
});

describe('Validators check', function() {

  describe('alpha', function() {
    it('should disallowed whitespaces', function(done) {
      var conforma = new Conforma();
      conforma.setData({
        value1: 'TESTm1eä3öüÄÜÖß',
        value2: 'TESTmeäöüÄÜÖß',
        value3: 'TEST me äöüÄÜÖß',
        value4: 'TEST m12e äöüÄÜÖß'
      })
        .validate('value1', 'alpha')
        .validate('value2', 'alpha')
        .validate('value3', 'alpha')
        .validate('value4', 'alpha')
        .exec()
        .catch(function(err) {
          var errors = err.errors;

          var err1 = errors.shift();
          assert.equal(err1.field, 'value1');

          var err2 = errors.shift();
          assert.equal(err2.field, 'value3');

          var err3 = errors.shift();
          assert.equal(err3.field, 'value4');
          done();
        });
    });

    it('should allowed whitespaces', function(done) {
      var conforma = new Conforma();
      conforma.setData({
        value1: 'TESTm1eä3öüÄÜÖß',
        value2: 'TESTmeäöüÄÜÖß',
        value3: 'TEST me äöüÄÜÖß',
        value4: 'TEST m12e äöüÄÜÖß'
      })
        .validate('value1', {'alpha': true})
        .validate('value2', {'alpha': true})
        .validate('value3', {'alpha': true})
        .validate('value4', {'alpha': true})
        .exec()
        .catch(function(err) {
          var errors = err.errors;

          var err1 = errors.shift();
          assert.equal(err1.field, 'value1');

          var err2 = errors.shift();
          assert.equal(err2.field, 'value4');
          done();
        });
    });
  });

  describe('alnum', function() {
    it('should disallowed whitespaces', function(done) {
      var conforma = new Conforma();
      conforma.setData({
        value1: 'TESTm1eä3öüÄÜÖß',
        value2: 'TESTmeäöüÄÜÖß',
        value3: 'TEST me äöüÄÜÖß',
        value4: 'TEST m12e äöüÄÜÖß'
      })
        .validate('value1', 'alnum')
        .validate('value2', 'alnum')
        .validate('value3', 'alnum')
        .validate('value4', 'alnum')
        .exec()
        .catch(function(err) {
          var errors = err.errors;

          var err1 = errors.shift();
          assert.equal(err1.field, 'value3');

          var err2 = errors.shift();
          assert.equal(err2.field, 'value4');

          done();
        });
    });

    it('should allowed whitespaces', function(done) {
      var conforma = new Conforma();
      conforma.setData({
        value1: 'TESTm1e2ä3öüÄÜÖß',
        value2: 'TESTmeäöüÄÜÖß',
        value3: 'TEST me äöüÄÜÖß',
        value4: 'TEST m12e 3äöüÄÜÖß45'
      })
        .validate('value1', {alnum: true})
        .validate('value2', {alnum: true})
        .validate('value3', {alnum: true})
        .validate('value4', {alnum: true})
        .exec()
        .then(function() {
          done();
        });
    });
  });

  describe('required', function() {
    it('should required', function(done) {
      var conforma = new Conforma();
      conforma.setData({
        value1: 'TEST',
        value2: '',
        value4: {
          child1: 'TEST',
          child2: '',
          child4: 0,
          child5: false,
          child6: null
        }
      })
        .validate('value1', ['required', 'notEmpty', 'required'])
        .validate('value2', 'required')
        .validate('value3', 'required')
        .validate('value4.child1', 'required')
        .validate('value4.child2', 'required')
        .validate('value4.child3', ['required', 'notEmpty', 'required'])
        .validate('value4.child4', 'required')
        .validate('value4.child5', 'required')
        .validate('value4.child6', 'required')
        .exec()
        .catch(function(err) {
          var errors = err.errors;

          var err1 = errors.shift();
          assert.equal(err1.field, 'value3');

          var err2 = errors.shift();
          assert.equal(err2.field, 'value4.child3');

          assert.equal(0, errors.length);
          done();
        });
    });
  });

  describe('notEmpty', function() {
    it('should not be empty', function(done) {
      var conforma = new Conforma();
      conforma.setData({
        value1: 'TEST',
        value2: '',
        value4: {
          child1: 'TEST',
          child2: ''
        },
        value5: 0,
        value6: '0',
        value7: false,
        value8: null
      })
        .validate('value1', 'notEmpty')
        .validate('value2', 'notEmpty')
        .validate('value3', 'notEmpty')
        .validate('value5', 'notEmpty')
        .validate('value6', 'notEmpty')
        .validate('value7', 'notEmpty')
        .validate('value8', 'notEmpty')
        .validate('value4.child1', 'notEmpty')
        .validate('value4.child2', 'notEmpty')
        .validate('value4.child3', 'notEmpty')
        .exec()
        .catch(function(err) {
          var errors = err.errors;

          var err1 = errors.shift();
          assert.equal(err1.field, 'value2');

          var err2 = errors.shift();
          assert.equal(err2.field, 'value4.child2');

          done();
        });
    });
  });

  describe('email', function() {
    it('should be error on wrong email address', function (done) {
      this.timeout(5000);

      var conforma = new Conforma();
      conforma.setData({
        value1: 'unknownmail@abrakadabrahost.com',
        value2: 'unknownmail@localhost',
        value3: 'unknownmail'
      })
        .validate('value1', 'email')
        .validate('value2', 'email')
        .validate('value3', 'email')
        .exec()
        .catch(function (err) {
          var errors = err.errors;

          var err1 = errors.shift();
          assert.equal(err1.field, 'value2');

          var err2 = errors.shift();
          assert.equal(err2.field, 'value3');

          done();
        });
    });
  });

  describe('emailMx', function() {
    it('should be error on unknown host', function (done) {
      this.timeout(5000);

      var conforma = new Conforma();
      conforma.setData({
        value1: 'unknownmail@abrakadabrahost.com',
        value2: 'unknownmail'
      })
        .validate('value1', 'emailMx')
        .validate('value2', 'emailMx')
        .exec()
        .catch(function (err) {
          var errors = err.errors;

          var err1 = errors.shift();
          assert.equal(err1.field, 'value1');

          var err2 = errors.shift();
          assert.equal(err2.field, 'value2');
          assert.equal(err2.message, 'email.invalid.format');

          done();
        });
    });

    it('should be ok on known host', function (done) {
      this.timeout(6000);

      var conforma = new Conforma();
      conforma.setData({
        value1: 'no-reply@gmail.com',
        value2: 'no-reply@hotmail.com'
      })
        .validate('value1', 'emailMx')
        .validate('value2', 'emailMx')
        .exec()
        .then(function() {
          done();
        });
    });
  });

  describe('contains', function() {
    it('should contains snippets', function(done) {
      var conforma = new Conforma();

      conforma.setData({
        value1: 'TEST'
      })
        .validate('value1', {contains: 'TEST'})
        .validate('value1', {contains: 'TE'})
        .validate('value1', {contains: 'ST'})
        .validate('value1', {contains: 'ES'})
        .exec()
        .then(function() {
          done();
        });
    });

    it('should not contains snippets', function(done) {
      var conforma = new Conforma();

      conforma.setData({
        value1: 'TEST'
      })
        .validate('value1', {contains: 'ABC'})
        .validate('value1', {contains: 'TA'})
        .validate('value1', {contains: '1'})
        .validate('value1', {contains: null})
        .validate('value1', {contains: false})
        .exec()
        .catch(function(err) {
          assert.equal(4, err.errors.length, 'contains not work');
          done();
        });
    });
  });

  describe('equals', function() {
    it('should equals', function(done) {
      var conforma = new Conforma();

      conforma.setData({
        value1: 'TEST',
        value2: 'test',
        value3: 12345,
        value4: true,
        value5: null
      })
        .validate('value1', {equals: 'TEST'})
        .validate('value2', {equals: 'test'})
        .validate('value3', {equals: 12345})
        .validate('value4', {equals: true})
        .validate('value5', {equals: null})
        .exec()
        .then(function() {
          done();
        });
    });

    it('should not equals', function(done) {
      var conforma = new Conforma();

      conforma.setData({
        value1: 'TEST',
        value2: false,
        value3: '12345'

      })
        .validate('value1', {equals: 'test'})
        .validate('value2', {equals: null})
        .validate('value3', {equals: 12345})
        .exec()
        .catch(function(err) {
          assert.equal(3, err.errors.length, 'equals not work');
          done();
        });
    });
  });

  describe('compare', function() {
    it('should equals', function(done) {
      var conforma = new Conforma();

      conforma.setData({
        string: {
          value1: 'password',
          value2: 'password'
        },
        number: {
          value1: 12345,
          value2: 12345
        },
        boolean: {
          value1: true,
          value2: true
        },
        null: {
          value1: null,
          value2: null
        }
      })
        .validate('string.value1', {compare: 'string.value2'})
        .validate('number.value1', {compare: 'number.value2'})
        .validate('boolean.value1', {compare: 'boolean.value2'})
        .validate('null.value1', {compare: 'null.value2'})
        .exec()
        .then(function() {
          done();
        });
    });

    it('should not equals', function(done) {
      var conforma = new Conforma();

      conforma.setData({
        string: {
          value1: 'PASSWORD',
          value2: 'password'
        },
        number: {
          value1: '12345',
          value2: 12345
        },
        mixed: {
          value1: true,
          value2: null
        }
      })
        .validate('string.value1', {compare: 'string.value2'})
        .validate('number.value1', {compare: 'number.value2'})
        .validate('mixed.value1', {compare: 'mixed.value2'})
        .exec()
        .catch(function(err) {
          assert.equal(3, err.errors.length, 'it compares wrong');
          done();
        });
    });
  });

  describe('isDate', function() {
    it('should validate date with format', function(done) {
      var conforma = new Conforma();

      conforma.setData({
        date1: '12.31.2015',
        date2: '31.12.2015'
      })
        .validate('date1', {isDate: 'MM.DD.YYYY'})
        .validate('date2', {isDate: 'DD.MM.YYYY'})
        .exec()
        .then(function() {
          done();
        });
    });

    it('should validate date without format', function(done) {
      var conforma = new Conforma();

      conforma.setData({
        date1: '12.31.2015',
        date2: '31.12.2015'
      })
        .validate('date1', 'isDate')
        .validate('date2', 'isDate')
        .exec()
        .catch(function(err) {
          assert.equal('date2', err.errors[0].field);
          done();
        });
    });
  });

});