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

  describe('addslashes', function() {
    it('value must be float', function() {
      var conforma = new Conforma();
      var filtered = conforma.setData({
        value1:'Lorem ipsum" dolo"r sit amet',
        value2:'Lorem ipsum\' dolo\'r sit amet',
        value3:'Lorem"ipsum\' dolo\'r sit"amet'
      })
        .filter('value1', 'addslashes')
        .filter('value2', 'addslashes')
        .filter('value3', 'addslashes')
        .getData(true);

      assert.equal('Lorem ipsum\\" dolo\\"r sit amet', filtered.value1, 'value1 is not escaped with slashes');
      assert.equal('Lorem ipsum\\\' dolo\\\'r sit amet', filtered.value2, 'value2 is not escaped with slashes');
      assert.equal('Lorem\\"ipsum\\\' dolo\\\'r sit\\"amet', filtered.value3, 'value3 is not escaped with slashes');
    });
  });

  describe('bool', function() {
    it('value must be boolean', function() {
      var conforma = new Conforma();
      var filtered = conforma.setData({
        value1:'YES',
        value2:'yes',
        value3:'1',
        value4:'0',
        value5:'on',
        value6:'false',
        value7:false,
        value8:null,
        value9:1,
        value10:2,
        value11:0,
        value12:undefined,
        value13:' ',
        value14:'',
        value15:'abc'

      })
        .filter('value1', 'bool')
        .filter('value2', 'bool')
        .filter('value3', 'bool')
        .filter('value4', 'bool')
        .filter('value5', 'bool')
        .filter('value6', 'bool')
        .filter('value7', 'bool')
        .filter('value8', 'bool')
        .filter('value9', 'bool')
        .filter('value10', 'bool')
        .filter('value11', 'bool')
        .filter('value12', 'bool')
        .filter('value13', 'bool')
        .filter('value14', 'bool')
        .filter('value15', 'bool')
        .getData(true);

      assert.strictEqual(true, filtered.value1, 'value1 must be true');
      assert.strictEqual(true, filtered.value2, 'value2 must be true');
      assert.strictEqual(true, filtered.value3, 'value3 must be true');
      assert.strictEqual(false, filtered.value4, 'value4 must be false');
      assert.strictEqual(true, filtered.value5, 'value5 must be true');
      assert.strictEqual(false, filtered.value6, 'value6 must be false');
      assert.strictEqual(false, filtered.value7, 'value7 must be false');
      assert.strictEqual(false, filtered.value8, 'value8 must be false');
      assert.strictEqual(true, filtered.value9, 'value9 must be true');
      assert.strictEqual(false, filtered.value10, 'value10 must be false');
      assert.strictEqual(false, filtered.value11, 'value11 must be false');
      assert.strictEqual(false, filtered.value12, 'value12 must be false');
      assert.strictEqual(false, filtered.value13, 'value13 must be false');
      assert.strictEqual(false, filtered.value14, 'value14 must be false');
      assert.strictEqual(false, filtered.value15, 'value15 must be false');
    });
  });
});