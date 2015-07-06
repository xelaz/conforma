
"use strict";

var assert = require("assert"),
  Conforma = require('../index').Conforma;

describe('Filter', function() {

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
        .validate('value1', 'required')
        .validate('value2', 'required')
        .validate('value3', 'required')
        .validate('value4.child1', 'required')
        .validate('value4.child2', 'required')
        .validate('value4.child3', 'required')
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

          done();
        });
    });

    it('should be ok on known host', function (done) {
      this.timeout(5000);

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

});