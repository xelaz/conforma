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

      assert.equal(1, data.child);
      assert.equal(22, data.parent.child2);
      assert.equal(3, data.parent.child3);
      assert.equal(2, data.next);
      assert.equal('', data.second);
      assert.equal(3, data.third.length);
    });
  });

  describe('reflective', function() {

    it('must contain only reflective data', function() {
      var conforma = new Conforma();
      var data = conforma
        .setData({
          child: 1,
          next: 2,
          parent: {
            child1: '4',
            child2: 22
          },
          foo: 'bar'
        })
        .reflective({
          child: null,
          parent: {
            child1: 0,
            child3: null
          }
        })
        .getData();

      assert.equal(1, data.child);
      assert.equal('undefined', typeof data.next);
      assert.equal('undefined', typeof data.parent.child2);
      assert.equal(null, data.parent.child3);
    });
  });
});