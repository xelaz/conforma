"use strict";

var assert = require("assert"),
  Conforma = require('../index').Conforma;

describe('Filter', function() {

  describe('trim', function() {
    it('should without spaces at prefix and suffix', function() {
      var conforma = new Conforma();
      var filtered = conforma.setData({
        value1:' test ',
        value2:'test    ',
        value3: ' test',
        value4: {
          value1: ' test '
        }})
        .filter('value1', 'trim')
        .filter('value2', 'trim')
        .filter('value3', 'trim')
        .filter('value4.value1', 'trim')
        .getData(true);

      assert.equal('test', filtered.value1);
      assert.equal('test', filtered.value2);
      assert.equal('test', filtered.value3);
      assert.equal('test', filtered.value4.value1);
    });
  });

  describe('int', function() {
    it('value must be integer', function() {
      var conforma = new Conforma();
      var filtered = conforma.setData({
        value1:'123',
        value2:2,
        value3:true,
        value4:false,
        value5:null,
        value6:2.51,
        value7:undefined,
        value8: 'abc',
        value9: '',
        value10: {
          value1: '123'
        }
      })
        .filter('value1', 'int')
        .filter('value2', 'int')
        .filter('value3', 'int')
        .filter('value4', 'int')
        .filter('value5', 'int')
        .filter('value6', 'int')
        .filter('value7', 'int')
        .filter('value8', 'int')
        .filter('value9', 'int')
        .filter('value10.value1', 'int')
        .getData(true);

      assert.equal(123, filtered.value1, 'value1 is not integer');
      assert.equal(2, filtered.value2, 'value2 is not integer');
      assert.equal(0, filtered.value3, 'value3 is not integer');
      assert.equal(0, filtered.value4, 'value4 is not integer');
      assert.equal(0, filtered.value5, 'value5 is not integer');
      assert.equal(2, filtered.value6, 'value6 is not integer');
      assert.equal(0, filtered.value7, 'value7 is not integer');
      assert.equal(0, filtered.value8, 'value8 is not integer');
      assert.equal(0, filtered.value9, 'value9 is not integer');
      assert.equal(123, filtered.value10.value1, 'value10.value1 is not integer');
    });
  });

  describe('float', function() {
    it('value must be float', function() {
      var conforma = new Conforma();
      var filtered = conforma.setData({
        value1:'123',
        value2:2,
        value3:true,
        value4:false,
        value5:null,
        value6:2.51,
        value7:undefined,
        value8: 'abc',
        value9: '',
        value10: '1.234'
      })
        .filter('value1', 'float')
        .filter('value2', 'float')
        .filter('value3', 'float')
        .filter('value4', 'float')
        .filter('value5', 'float')
        .filter('value6', 'float')
        .filter('value7', 'float')
        .filter('value8', 'float')
        .filter('value9', 'float')
        .filter('value10', 'float')
        .getData(true);

      assert.equal(123, filtered.value1, 'value1 is not float');
      assert.equal(2, filtered.value2, 'value2 is not float');
      assert.equal(0, filtered.value3, 'value3 is not float');
      assert.equal(0, filtered.value4, 'value4 is not float');
      assert.equal(0, filtered.value5, 'value5 is not float');
      assert.equal(2.51, filtered.value6, 'value6 is not float');
      assert.equal(0, filtered.value7, 'value7 is not float');
      assert.equal(0, filtered.value8, 'value8 is not float');
      assert.equal(0, filtered.value9, 'value9 is not float');
      assert.equal(1.234, filtered.value10, 'value10 is not float');
    });
  });

});