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
      .filter('value2', ['string', 'lowerCase'])
      .filter('value3', function(value) {
        return value + 'TEST';
      })
      .filter('value4', 'unknown')
      .filter('value5', ['lowerCase', 'stringLength', {stringLength: 3}])
      .filter('value6', {stringLength: 2})
      .filter('value7', ['string', 'lowerCase'])
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

  describe('digit', function() {
    it('value must be digit', function() {
      var conforma = new Conforma();
      var filtered = conforma.setData({
        value1: '123',
        value2: 123,
        value3: true,
        value4: false,
        value5: null,
        value6: 2.51,
        value7: undefined,
        value8: 'abc123',
        value9: '',
        value10: {
          value1: '123'
        },
        value11: '0123',
        value12: '0000',
        value13: 'ABcDeF'
      })
        .filter('value1', 'digit')
        .filter('value2', 'digit')
        .filter('value3', 'digit')
        .filter('value4', 'digit')
        .filter('value5', 'digit')
        .filter('value6', 'digit')
        .filter('value7', 'digit')
        .filter('value8', 'digit')
        .filter('value9', 'digit')
        .filter('value10.value1', 'digit')
        .filter('value11', 'digit')
        .filter('value12', 'digit')
        .filter('value13', 'digit')
        .getData(true);

      assert.equal(123, filtered.value1, 'value1 is not digit');
      assert.equal(123, filtered.value2, 'value2 is not digit');
      assert.equal(0, filtered.value3, 'value3 is not digit');
      assert.equal(0, filtered.value4, 'value4 is not digit');
      assert.equal(0, filtered.value5, 'value5 is not digit');
      assert.equal(2.51, filtered.value6, 'value6 is not digit');
      assert.equal(0, filtered.value7, 'value7 is not digit');
      assert.equal('123', filtered.value8, 'value8 is not digit');
      assert.equal(0, filtered.value9, 'value9 is not digit');
      assert.equal(123, filtered.value10.value1, 'value10.value1 is not digit');
      assert.equal(123, filtered.value11, 'value11 is not digit');
      assert.equal('0000', filtered.value12, 'value12 is not digit');
      assert.equal('', filtered.value13, 'value13 is not digit');
    });
  });

  describe('int', function() {
    it('value must be integer', function() {
      var conforma = new Conforma();
      var filtered = conforma.setData({
        value1: '123',
        value2: 123,
        value3: true,
        value4: false,
        value5: null,
        value6: 2.51,
        value7: undefined,
        value8: 'abc',
        value9: '',
        value10: {
          value1: '123'
        },
        value11: '0123',
        value12: '0000'
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
        .filter('value12', 'int')
        .getData(true);

      assert.strictEqual(123, filtered.value1, 'value1 is not integer');
      assert.strictEqual(123, filtered.value2, 'value2 is not integer');
      assert.strictEqual(0, filtered.value3, 'value3 is not integer');
      assert.strictEqual(0, filtered.value4, 'value4 is not integer');
      assert.strictEqual(0, filtered.value5, 'value5 is not integer');
      assert.strictEqual(2, filtered.value6, 'value6 is not integer');
      assert.strictEqual(0, filtered.value7, 'value7 is not integer');
      assert.strictEqual(0, filtered.value8, 'value8 is not integer');
      assert.strictEqual(0, filtered.value9, 'value9 is not integer');
      assert.strictEqual(123, filtered.value10.value1, 'value10.value1 is not integer');
      assert.strictEqual(123, filtered.value11, 'value11 is not integer');
      assert.strictEqual(0, filtered.value12, 'value12 is not integer');
    });
  });

  describe('float', function() {
    it('value must be float', function() {
      var conforma = new Conforma();
      var filtered = conforma.setData({
        value1:'123',
        value2:123,
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

      assert.strictEqual(123, filtered.value1, 'value1 is not float');
      assert.strictEqual(123, filtered.value2, 'value2 is not float');
      assert.strictEqual(0, filtered.value3, 'value3 is not float');
      assert.strictEqual(0, filtered.value4, 'value4 is not float');
      assert.strictEqual(0, filtered.value5, 'value5 is not float');
      assert.strictEqual(2.51, filtered.value6, 'value6 is not float');
      assert.strictEqual(0, filtered.value7, 'value7 is not float');
      assert.strictEqual(0, filtered.value8, 'value8 is not float');
      assert.strictEqual(0, filtered.value9, 'value9 is not float');
      assert.strictEqual(1.234, filtered.value10, 'value10 is not float');
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
      /** @type {Conforma} */
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
      var filtered = Conforma({
        value1: 'TEST@maIL.Com',
        value2: '!§$%&email+12345-!§$%&@this is host,.com',
        value3: '!§$%&üm-äil.12345-all@googlemail.com'
      })
        .filter('value1', 'email')
        .filter('value2', 'email')
        .filter('value3', 'email')
        .getData(true);

      assert.equal('test@mail.com', filtered.value1, 'value1 is not valid mail');
      assert.equal('email12345-@thisishost.com', filtered.value2, 'value2 is not valid mail');
      assert.equal('üm-äil.12345-all@gmail.com', filtered.value3, 'value3 is not valid mail');
    });
  });

  describe('stringLength', function() {
    it('should allowed length', function() {
      var filtered = Conforma({
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

  describe('lowerCase', function() {
    it('value must be in lower case', function() {
      var filtered = Conforma({
        value1:'LoreM IpsuM'
      })
        .filter('value1', 'lowerCase')
        .getData(true);

      assert.equal('lorem ipsum', filtered.value1, 'value1 is not lower case sesitive');
    });
  });

  describe('upperCase', function() {
    it('value must be in upper case', function() {
      var filtered = Conforma({
        value1:'lorem IpsuM'
      })
        .filter('value1', 'upperCase')
        .getData(true);

      assert.equal('LOREM IPSUM', filtered.value1, 'value1 is not upper case sesitive');
    });
  });

  describe('string', function() {
    it('value must be a string', function() {
      var filtered = Conforma({
        value1: 'STRING',
        value2: 12345,
        value3: null,
        value4: undefined,
        value5: [1,2,3],
        value6: false,
        value7: {test: 1, test2: 'test'},
        value8: {},
        value9: function() {},
        value10: []
      })
        .filter('value1', 'string')
        .filter('value2', 'string')
        .filter('value3', 'string')
        .filter('value4', 'string')
        .filter('value5', 'string')
        .filter('value6', 'string')
        .filter('value7', 'string')
        .filter('value8', 'string')
        .filter('value9', 'string')
        .filter('value10', 'string')
        .getData(true);

      assert.strictEqual('STRING', filtered.value1, 'value1 is not string');
      assert.strictEqual('12345', filtered.value2, 'value2 is not string');
      assert.strictEqual('', filtered.value3, 'value3 is not string');
      assert.strictEqual('', filtered.value4, 'value4 is not string');
      assert.strictEqual('1,2,3', filtered.value5, 'value5 is not string');
      assert.strictEqual('false', filtered.value6, 'value6 is not string');
      assert.strictEqual('[object Object]', filtered.value7, 'value7 is not string');
      assert.strictEqual('[object Object]', filtered.value8, 'value8 is not string');
      assert.strictEqual('', filtered.value9, 'value9 is not string');
      assert.strictEqual('', filtered.value10, 'value10 is not string');
    });
  });
});