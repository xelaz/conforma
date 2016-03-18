"use strict";

var assert = require("assert"),
  Conforma = require('../index').Conforma;

describe('Data', function() {

  describe('default', function() {

    it('set default data then main data', function() {
      var conforma = new Conforma();
      var data = conforma
        .default({
          child:2,
          parent: {
            child1: 1,
            child2: '2',
            child3:3
          },
          second: '',
          third: [1, 2, 3]
        }).setData({
          child: 1,
          next: 2,
          parent: {
            child4:4,
            child2: 22
          }
        })
        .getData();

      assert.equal(1, data.child);
      assert.equal(22, data.parent.child2);
      assert.equal(3, data.parent.child3);
      assert.equal(2, data.next);
      assert.equal('', data.second);
      assert.equal(3, data.third.length);
    });

    it('set data data without new', function() {
      var data = Conforma({
        child: 1,
        next: 2,
        parent: {
          child4:4,
          child2: 22
        }
      }).default({
          child:2,
          parent: {
            child1: 1,
            child2: '2',
            child3:3
          },
          second: '',
          third: [1, 2, 3]
        }).setData()
        .getData();

      assert.equal(data.child, 1);
      assert.equal(data.parent.child2, 22);
      assert.equal(data.parent.child3, 3);
      assert.equal(data.next, 2);
      assert.equal(data.second, '');
      assert.equal(data.third.length, 3);
    });

    it('set main data then default', function() {
      var conforma = new Conforma();
      var data = conforma
        .setData({
          child: 1,
          next: 2,
          parent: {
            child4:4,
            child2: 22
          }
        })
        .default({
          child:2,
          parent: {
            child1: 1,
            child2: '2',
            child3:3
          },
          second: '',
          third: [1, 2, 3]
        })
        .getData();

      assert.equal(data.child, 1);
      assert.equal(data.parent.child2, 22);
      assert.equal(data.parent.child3, 3);
      assert.equal(data.next,2);
      assert.equal(data.second, '');
      assert.equal(data.third.length, 3);
    });
  });

  describe('conform', function() {
    it('must contain only conformed data structure', function () {
      var data = Conforma({
        child:  1,
        next:   2,
        parent: {
          child1: '4',
          child2: 22,
          child4: 0,
          child5: false,
          child6: null
        },
        foo:    'bar',

        fun2: function () {
          console.log('fun');
        }
      })
        .conform({
          child:  undefined,
          parent: {
            child1: undefined,
            child3: undefined,
            child4: undefined,
            child5: undefined,
            child6: undefined
          },

          fun: function () {
            console.log('fun');
          }
        })
        .getData();

      assert.strictEqual(1, data.child);
      assert.strictEqual('4', data.parent.child1);
      assert.strictEqual(0, data.parent.child4);
      assert.strictEqual(false, data.parent.child5);
      assert.strictEqual(null, data.parent.child6);
      assert.equal('undefined', typeof data.next, 'data.next must be undefined');
      assert.equal('undefined', typeof data.parent.child2, 'data.parent.child2 must be undefined');
      assert.strictEqual(undefined, data.parent.child3);
    });

    it('should conform with filter', function () {
      var data = Conforma({
        child:  1,
        next:   2,
        parent: {
          child1: '4',
          child2: 22,
          child4: 0,
          child5: false,
          child6: null
        },
        foo:   'bar',
        foo1:  ['bar'],
        foo2:  undefined,
        bar:   null,
        bar1:  {test: 123},
        trash: 123,

        fun2: function () {
          console.log('fun');
        }
      })
        .filter('parent', 'object')
        .filter('parent.child1', 'int')
        .filter('parent.child2', 'string')
        .filter('parent.child3', 'bool')
        .filter('next', 'int')
        .filter('foo', 'array')
        .filter('foo1', 'array')
        .filter('foo1.1', 'string')
        .filter('foo1.2', 'int')
        .filter('foo2', 'array')
        .filter('foo3', 'array')
        .filter('bar', 'object')
        .filter('bar1', 'object')
        .filter('bar1.test', 'string')
        .conform(true)
        .getData(true);

      assert.strictEqual(data.child, undefined);
      assert.strictEqual(data.parent.child1, 4);
      assert.strictEqual(data.parent.child4, undefined);
      assert.ok(Array.isArray(data.foo));
      assert.ok(Array.isArray(data.foo1));
      assert.ok(Array.isArray(data.foo2));
      assert.ok(Array.isArray(data.foo3));
      assert.strictEqual(data.foo1[2], 0);
      assert.ok(data.bar !== null);
      assert.strictEqual(data.bar1.test, '123');
      assert.strictEqual(data.trash, undefined);
    });
  });

  describe('move', function() {
    it('must src node to dest node and remove src node', function() {
      var data = Conforma({
          node1: {
            data: [1,2,3]
          },
          node2: {},
          node3: {
            child1: 1,
            child2: {
              bigNode: 123,
              maxDode: 234
            }
          },
          node: {
            test: 'TEST'
          }
        })
        .move('node1.data', 'node2')
        .move('node', 'node4.child.sub')
        .move('node3.child2')
        .getData();

      assert.equal(0, Object.keys(data.node1).length);
      assert.ok(Array.isArray(data.node2));
      assert.equal(1, data.node3.child1);
      assert.equal('TEST', data.node4.child.sub.test);
      assert.equal(123, data.bigNode);
      assert.equal(234, data.maxDode);
      assert.equal('undefined', typeof data.node);
    });
  });

  describe('overwrite', function() {
    it('should not overwrite conform data', function () {
      var conform = {
        test: 111,
        sub: {
          numbers: 111
        }
      };

      var cnf = Conforma({
        test: 222,
        sub: {
          numbers: 222
        }
      }).conform(conform);

      var ndata = cnf.getData();


      assert.equal(222, ndata.test);
      assert.equal(222, ndata.sub.numbers);

      ndata.test = 555;
      ndata.sub.numbers = 555;

      assert.equal(111, conform.test);
      assert.equal(111, conform.sub.numbers);
    });

    it('should not overwrite data', function () {
      var cnf = Conforma({
        test: 222,
        sub: {
          numbers: 222
        }
      });

      var ndata = cnf.getData();

      assert.equal(ndata.test, 222);
      assert.equal(ndata.sub.numbers, 222);

      ndata.test = 333;
      ndata.sub.numbers = 333;

      var ndata2 = cnf.getData();

      assert.equal(ndata2.test, 222);
      assert.equal(ndata2.sub.numbers, 222);

      var next = cnf.getValue('test');
      next = 444;

      assert.equal(cnf.getValue('test'), 222);
      assert.equal(cnf.getValue('sub.numbers'), 222);
    });
  });
});