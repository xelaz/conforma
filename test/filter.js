"use strict";

var assert = require("assert"),
  Conforma = require('../index').Conforma;

describe('Conforma.filter args check', function() {
  it('should add filter', function() {
    var formData = new Conforma();
    var filteredData = formData.setData({
      value1: 123,
      value2: 'TEST',
      value3: 'TEST',
      value4: 'TEST',
      value5: 'TEST',
      value6: 'TEST'
    })
      .filter('value1', 'string')
      .filter('value2', ['string', 'toLowerCase'])
      .filter('value3', function(value) {
        return value + 'TEST';
      })
      .filter('value4', 'unknown')
      .filter('value5', ['toLowerCase', 'stringLength', {stringLength: 3}])
      .filter('value6', {stringLength: 2})
      .filter('value7', ['string', 'toLowerCase'])
      .getData(true);

    assert.strictEqual('123', filteredData.value1, 'value1');
    assert.strictEqual('test', filteredData.value2, 'value2');
    assert.equal('TESTTEST', filteredData.value3, 'value3');
    assert.equal('TEST', filteredData.value4, 'value4');
    assert.equal('tes', filteredData.value5, 'value5');
    assert.equal('TE', filteredData.value6, 'value6');
    assert.equal('', filteredData.value7, 'value7');
  });
});

describe('Filters check', function() {

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
        },
        value11:'0123'
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
        .filter('value11', 'int')
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
      assert.equal(123, filtered.value11, 'value11 is not integer');
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

  describe('email', function() {
    it('should normalize email', function() {
      var conforma = new Conforma();
      var filtered = conforma.setData({
        value1:'TEST@maIL.Com',
        value2:'email+12345-!§$%&@this is host,.com'
      })
        .filter('value1', 'email')
        .filter('value2', 'email')
        .getData(true);

      assert.equal('test@mail.com', filtered.value1, 'value1 is not valid mail');
      assert.equal('email12345@thisishost.com', filtered.value2, 'value2 is not valid mail');
    });
  });

  describe('stringLength', function() {
    it('should max size', function() {
      var conforma = new Conforma();
      var filtered = conforma.setData({
        value1: 'String length without max param.',
        value2:'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonümy eirmod tempor invidunt ut '
              +'labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores '
              +'et ea rebum. Stet clita kasd gubergren, nö sea takimata sanctus est Lorem ipsum dolor sit ämet.'
      })
        .filter('value1', 'stringLength')
        .filter('value2', {stringLength: 128})
        .getData(true);

      assert.equal(32, filtered.value1.length, 'value1 is not same length');
      assert.equal(128, filtered.value2.length, 'value2 is not same length');
    });
  });
});