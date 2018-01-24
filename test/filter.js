"use strict";

var assert = require("assert"),
  Conforma = require('../index').Conforma;

describe('Conforma.filter args check', function () {
  it('should add filter', function () {
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
      .filter('value3', function (value) {
        return value + 'TEST';
      })
      .filter('value4', 'int')
      .filter('value5', ['lowerCase', {stringLength: 3}])
      .filter('value6', {stringLength: 2})
      .filter('value7', ['string', 'lowerCase'])
      .getData(true);

    assert.strictEqual(filteredData.value1, '123');
    assert.strictEqual(filteredData.value2, 'test');
    assert.equal(filteredData.value3, 'TESTTEST');
    assert.equal(filteredData.value4, 0);
    assert.equal(filteredData.value5, 'tes');
    assert.equal(filteredData.value6, 'TE');
    assert.equal(filteredData.value7, '');
  });

  it('should throw error on unknown filter', function () {
    var formData = new Conforma();
    try {
      return formData.setData({
        value1: 123
      })
        .filter('value1', 'unknown')
        .exec();
    } catch (err) {
      assert.ok(err == 'Error: Filter "unknown" not available');
    }
  });

  it('should throw error on unknown filter if getData', function () {
    try {
      Conforma({
        value1: 123
      })
        .filter('value1', 'unknown')
        .getData(true);
    } catch (err) {
      assert.ok(err == 'Error: Filter "unknown" not available');
      return;
    }

    throw new Error('Filter not valid');
  });
});

describe('Filters check', function () {
  describe('trim', function () {
    it('should without spaces at prefix and suffix', function () {
      var conforma = new Conforma();
      var filtered = conforma.setData({
        value1: ' test ',
        value2: 'test    ',
        value3: ' test',
        value4: {
          value1: ' test '
        }
      })
        .filter('value1', 'trim')
        .filter('value2', 'trim')
        .filter('value3', 'trim')
        .filter('value4.value1', 'trim')
        .getData(true);

      assert.equal(filtered.value1, 'test');
      assert.equal(filtered.value2, 'test');
      assert.equal(filtered.value3, 'test');
      assert.equal(filtered.value4.value1, 'test');
    });
  });

  describe('digit', function () {
    it('value must be digit', function () {
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

  describe('int', function () {
    it('value must be integer', function () {
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

  describe('float', function () {
    it('value must be float', function () {
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

  describe('addSlashes', function () {
    it('value must be float', function () {
      var conforma = new Conforma();
      var filtered = conforma.setData({
        value1: 'Lorem ipsum" dolo"r sit amet',
        value2: 'Lorem ipsum\' dolo\'r sit amet',
        value3: 'Lorem"ipsum\' dolo\'r sit"amet'
      })
        .filter('value1', 'addSlashes')
        .filter('value2', 'addSlashes')
        .filter('value3', 'addSlashes')
        .getData(true);

      assert.equal('Lorem ipsum\\" dolo\\"r sit amet', filtered.value1, 'value1 is not escaped with slashes');
      assert.equal('Lorem ipsum\\\' dolo\\\'r sit amet', filtered.value2, 'value2 is not escaped with slashes');
      assert.equal('Lorem\\"ipsum\\\' dolo\\\'r sit\\"amet', filtered.value3, 'value3 is not escaped with slashes');
    });
  });

  describe('bool', function () {
    it('value must be boolean', function () {
      var conforma = new Conforma();
      /** @type {Conforma} */
      var filtered = conforma.setData({
        value1: 'YES',
        value2: 'yes',
        value3: '1',
        value4: '0',
        value5: 'on',
        value6: 'false',
        value7: false,
        value8: null,
        value9: 1,
        value10: 2,
        value11: 0,
        value12: undefined,
        value13: ' ',
        value14: '',
        value15: 'abc'
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

  describe('email', function () {
    it('should normalize email', function () {
      var filtered = Conforma({
        value1: 'TEST@maIL.Com',
        value2: '!§$%&email+12345-!§$%&@this is host,.com',
        value3: '_!§$%&üm-äil._12345-all_@googlemail.com',
        value4: '_!§$%&üm-äil._12345-all_@hot-mail.com'
      })
        .filter('value1', 'email')
        .filter('value2', 'email')
        .filter('value3', 'email')
        .filter('value4', 'email')
        .getData(true);

      assert.equal('test@mail.com', filtered.value1, 'value1 is not valid mail');
      assert.equal('email12345-@thisishost.com', filtered.value2, 'value2 is not valid mail');
      assert.equal('_üm-äil._12345-all_@gmail.com', filtered.value3, 'value3 is not valid mail');
      assert.equal('_üm-äil._12345-all_@gmail.com', filtered.value3, 'value3 is not valid mail');
      assert.equal('_üm-äil._12345-all_@hot-mail.com', filtered.value4, 'value4 is not valid mail');
    });
  });

  describe('stringLength', function () {
    it('should allowed length', function () {
      var filtered = Conforma({
        value1: 'String length without max param.',
        value2: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonümy eirmod tempor invidunt ut '
        + 'labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores '
        + 'et ea rebum. Stet clita kasd gubergren, nö sea takimata sanctus est Lorem ipsum dolor sit ämet.'
      })
        .filter('value1', 'stringLength')
        .filter('value2', {stringLength: 128})
        .getData(true);

      assert.equal(32, filtered.value1.length, 'value1 is not same length');
      assert.equal(128, filtered.value2.length, 'value2 is not same length');
    });
  });

  describe('lowerCase', function () {
    it('value must be in lower case', function () {
      var filtered = Conforma({
        value1: 'LoreM IpsuM'
      })
        .filter('value1', 'lowerCase')
        .getData(true);

      assert.equal('lorem ipsum', filtered.value1, 'value1 is not lower case sesitive');
    });
  });

  describe('upperCase', function () {
    it('value must be in upper case', function () {
      var filtered = Conforma({
        value1: 'lorem IpsuM'
      })
        .filter('value1', 'upperCase')
        .getData(true);

      assert.equal('LOREM IPSUM', filtered.value1, 'value1 is not upper case sesitive');
    });
  });

  describe('string', function () {
    it('value must be a string', function () {
      var filtered = Conforma({
        value1: 'STRING',
        value2: 12345,
        value3: null,
        value4: undefined,
        value5: [1, 2, 3],
        value6: false,
        value7: {test: 1, test2: 'test'},
        value8: {},
        value9: function () {
        },
        value10: [],
        value11: '<div>Hänsel&Gretel</div>>&"\'<'
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
        .filter('value11', {string: true})
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
      assert.strictEqual(filtered.value11, 'Hänsel&amp;Gretel&gt;&amp;&quot;\'&lt;');
    });
  });

  describe('url', function () {
    it('should convert to valid url', function () {
      var filtered = Conforma({
        value1: 'http://www.github.com',
        value2: 'github.com',
        value3: 'http://www.github.com/user?test=true',
        value4: 'abrakadabra',
        value5: '<test>!$%&/(',
      })
        .filter('value1', 'url')
        .filter('value2', 'url')
        .filter('value3', {url: {allowedFields: ['protocol', 'hostname']}})
        .filter('value4', 'url')
        .filter('value5', 'url')
        .getData(true);

      assert.strictEqual('http://www.github.com/', filtered.value1, 'value1 is not filtered url');
      assert.strictEqual('github.com', filtered.value2, 'value2 is not filtered url');
      assert.strictEqual('http://www.github.com', filtered.value3, 'value3 is not filtered url');
      assert.strictEqual('abrakadabra', filtered.value4, 'value4 is not filtered url');
      assert.strictEqual('%3Ctest%3E!$%&/(', filtered.value5, 'value5 is not filtered url');
    });
  });

  describe('date', function () {
    it('should convert to valid date', function () {
      var filtered = Conforma({
        value1: '2015',
        value2: '2015-12-23',
        value3: '12.12.2015',
        value4: '',
        value5: '123abra'
      })
        .filter('value1', {date: 'YYYY'})
        .filter('value2', {date: 'YYYY-MM-DD'})
        .filter('value3', {date: 'DD.MM.YYYY'})
        .filter('value4', {date: 'DD.MM.YYYY'})
        .filter('value5', {date: 'DD.MM.YYYY'})
        .getData(true);

      assert.strictEqual(filtered.value1.getFullYear(), 2015, 'value1 invalid date');
      assert.strictEqual(filtered.value2.getDate(), 23, 'value2 invalid date');
      assert.strictEqual(filtered.value3.getMonth(), 11, 'value3 invalid date');
      assert.equal(filtered.value4, '', 'value4 invalid date');
      assert.equal(filtered.value5, 'Invalid Date', 'value5 invalid date');
    });
  });

  describe('function', function () {
    it('should convert to valid date', function () {
      var filtered = Conforma({
        value1: 2015,
        value2: 5
      })
        .filter('value1', function (value) {
          return value + 10
        })
        .filter('value2', function (value) {
          return String(value)
        })
        .getData(true);

      assert.strictEqual(filtered.value1, 2025);
      assert.strictEqual(filtered.value2, '5');
    });
  });

  describe('object', function () {
    it('should return object', function () {
      var filtered = Conforma({
        value1: 'string',
        value2: '{}',
        value3: '{foo: "bar"}',
        value4: '{"foo": "bar"}',
        value5: {foo: 'bar'},
        value6: function () {
        },
        value7: true,
        value8: 12345,
        value9: null,
        value10: undefined
      })
        .filter('value1', 'object')
        .filter('value2', 'object')
        .filter('value3', 'object')
        .filter('value4', 'object')
        .filter('value5', 'object')
        .filter('value6', 'object')
        .filter('value7', 'object')
        .filter('value8', 'object')
        .filter('value9', 'object')
        .filter('value10', 'object')
        .getData(true);

      assert.strictEqual(typeof filtered.value1, 'object');
      assert.strictEqual(typeof filtered.value2, 'object');
      assert.strictEqual(typeof filtered.value3, 'object');
      assert.strictEqual(typeof filtered.value4, 'object');
      assert.strictEqual(typeof filtered.value5, 'object');
      assert.strictEqual(typeof filtered.value6, 'object');
      assert.strictEqual(typeof filtered.value7, 'object');
      assert.strictEqual(typeof filtered.value8, 'object');
      assert.strictEqual(typeof filtered.value9, 'object');
      assert.strictEqual(typeof filtered.value10, 'object');
    });

    it('should return object copy or empty object', function () {
      var filtered = Conforma({
        value1: 'string',
        value2: '{}',
        value3: '{foo: "bar"}',
        value4: '{"foo": "bar"}',
        value5: {foo: 'bar'},
        value6: function () {},
        value7: true,
        value8: 12345,
        value9: null,
        value10: undefined
      })
        .filter('value1', {object: true})
        .filter('value2', {object: true})
        .filter('value3', {object: true})
        .filter('value4', {object: true})
        .filter('value5', {object: true})
        .filter('value6', {object: true})
        .filter('value7', {object: true})
        .filter('value8', {object: true})
        .filter('value9', {object: true})
        .filter('value10', {object: true})
        .getData(true);

      assert.strictEqual(typeof filtered.value1, 'object');
      assert.strictEqual(typeof filtered.value2, 'object');
      assert.strictEqual(typeof filtered.value3, 'object');
      assert.strictEqual(typeof filtered.value4, 'object');
      assert.strictEqual(typeof filtered.value5, 'object');
      assert.strictEqual(typeof filtered.value6, 'object');
      assert.strictEqual(typeof filtered.value7, 'object');
      assert.strictEqual(typeof filtered.value8, 'object');
      assert.strictEqual(typeof filtered.value9, 'object');
      assert.strictEqual(typeof filtered.value10, 'object');

      assert.strictEqual(Object.keys(filtered.value1).length, 0);
      assert.strictEqual(Object.keys(filtered.value2).length, 0);
      assert.strictEqual(Object.keys(filtered.value3).length, 0);
      assert.strictEqual(Object.keys(filtered.value6).length, 0);
      assert.strictEqual(Object.keys(filtered.value7).length, 0);
      assert.strictEqual(Object.keys(filtered.value8).length, 0);
      assert.strictEqual(Object.keys(filtered.value9).length, 0);
      assert.strictEqual(Object.keys(filtered.value10).length, 0);

      assert.strictEqual(filtered.value4.foo, 'bar');
      assert.strictEqual(filtered.value5.foo, 'bar');
    });
  });

  describe('uniqueList', function () {
    it('should return unique values in array', function () {
      var filtered = Conforma({
        value1: ['123', '123', 123, 'foo', 'bar', 'foo']
      })
        .filter('value1', 'uniqueList')
        .getData(true);

      assert.strictEqual(filtered.value1.length, 4);
    });
  });

  describe('stripHtmlTags', function () {
    it('should return  Html Tags from string', function () {
      var filtered = Conforma({
        value1: '<div class="my-class">tag</div>',
        value2: 'before <div name="foo">tag</div> after'
      })
        .filter('value1', 'stripHtmlTags')
        .filter('value2', 'stripHtmlTags')
        .getData(true);

      assert.strictEqual(filtered.value1, 'tag');
      assert.strictEqual(filtered.value2, 'before tag after');
    });
  });

  describe('drop', function () {
    it('should return object after drop nodes', function () {
      var filtered = Conforma()
        .filter('value1', 'object')
        .filter('value1.child', 'string')
        .filter('value2', 'string')
        .filter('value3', 'object')
        .filter('value3.child', 'string')
        .filter('value3.child2', 'string')
        .filter('value3.child3', 'string')
        .drop('value1.child, value2')
        .drop('value3.child', 'value3.child3')
        .getData(true);

      assert.strictEqual(typeof filtered.value1, 'object');
      assert.strictEqual(filtered.value1.child, undefined);
      assert.strictEqual(typeof filtered.value3.child2, 'string');
      assert.strictEqual(filtered.value2, undefined);
      assert.strictEqual(filtered.value3.child, undefined);
      assert.strictEqual(filtered.value3.child3, undefined);
      //assert.strictEqual(filtered.value2, 'before tag after');
    });
  });
});
