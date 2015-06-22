"use strict";

var assert = require("assert"),
  Conforma = require('../index');

describe('Filter', function(){

  describe('trim', function(){
    it('should without spaces at prefix and suffix', function(){
      var conforma = new Conforma();
      var filtered = conforma.setData({
        value1:' test ',
        value2:'test    ',
        value3: ' test'})
        .filter('value1', 'trim')
        .filter('value2', 'trim')
        .filter('value3', 'trim')
        .getData(true);

      assert.equal('test', filtered.value1);
      assert.equal('test', filtered.value2);
      assert.equal('test', filtered.value3);
    });
  });

  describe('int', function(){
    it('value must be integer', function(){
      var conforma = new Conforma();
      var filtered = conforma.setData({
        value1:'123',
        value2:2,
        value3:true,
        value4:false,
        value5:null,
        value6:2.51,
        value7:undefined,
        value8: 'abc'
      })
        .filter('value1', 'int')
        .filter('value2', 'int')
        .filter('value3', 'int')
        .filter('value4', 'int')
        .filter('value5', 'int')
        .filter('value6', 'int')
        .filter('value7', 'int')
        .filter('value8', 'int')
        .getData(true);

      assert.equal(123, filtered.value1, 'value1 is not integer');
      assert.equal(2, filtered.value2, 'value2 is not integer');
      assert.equal(1, filtered.value3, 'value3 is not integer');
      assert.equal(0, filtered.value4, 'value4 is not integer');
      assert.equal(0, filtered.value5, 'value5 is not integer');
      assert.equal(2, filtered.value6, 'value6 is not integer');
      assert.equal(0, filtered.value7, 'value7 is not integer');
      assert.equal(0, filtered.value8, 'value8 is not integer');
    });
  });
});