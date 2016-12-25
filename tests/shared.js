import chai from 'chai';
import Heimdall from 'heimdalljs/heimdall';
import { loadFromNode } from '../src';

const { expect } = chai;

describe('heimdalljs-graph-shared', function() {
  let node;

  class StatsSchema {
    constructor() {
      this.x = 0;
      this.y = 0;
    }
  }

  beforeEach( function() {
    let heimdall = new Heimdall();
    heimdall.registerMonitor('mystats', StatsSchema);

    /*
          tree
          ----
           j    <-- root
         /   \
        f      k
      /   \      \
     a     h      z
      \
       d
    */

    let j = heimdall.start('j');
    let f = heimdall.start('f');
    let a = heimdall.start('a');
    let d = heimdall.start('d');
    d.stop();
    a.stop();
    let h = heimdall.start('h');
    h.stop();
    f.stop();
    let k = heimdall.start('k');
    let z = heimdall.start('z');
    z.stop();
    k.stop();

    node = heimdall.root._children[0];
  });

  describe('.loadFromNode', function() {
    it('loads without error', function() {
      expect(() => {
        loadFromNode(node);
      }).to.not.throw();
    });
  });

  describe('dfsIterator', function() {
    it('works', function() {
      let tree = loadFromNode(node);

      let names = [];
      for (let node of tree.dfsIterator()) {
        names.push(node.label.name);
      }
      expect(names, 'depth first, pre order').to.eql([
        'j','f','a','d','h','k','z'
      ]);
    });
  });

  describe('bfsIterator', function() {
    it('works', function() {
      let tree = loadFromNode(node);

      let names = [];
      for (let node of tree.bfsIterator()) {
        names.push(node.label.name);
      }
      expect(names).to.eql([
        'j', 'f', 'k', 'a', 'h', 'z', 'd'
      ]);
    });

    it('allows specifying `until`', function() {
      let tree = loadFromNode(node);

      let names = [];
      for (let node of tree.bfsIterator(n => n.label.name === 'a')) {
        names.push(node.label.name);
      }
      expect(names).to.eql([
        'j', 'f', 'k', 'h', 'z'
      ]);
    });
  });

  describe('ancestorsIterator', function() {
    it('works', function() {
      let tree = loadFromNode(node);

      let d = null;
      for (let node of tree.dfsIterator()) {
        if (node.label.name === 'd') {
          d = node;
          break;
        }
      }

      let names = [];
      for (let node of d.ancestorsIterator()) {
        names.push(node.label.name);
      }
      expect(names).to.eql([
        'a', 'f', 'j'
      ]);
    });
  });

  describe('adjacentIterator', function() {
    it('works', function() {
      let tree = loadFromNode(node);

      let names = [];
      for (let node of tree.adjacentIterator()) {
        names.push(node.label.name);
      }

      expect(names, 'adjacent nodes').to.eql([
        'f', 'k'
      ]);
    });
  });

  describe('Symbol.iterator', function() {
    it('works', function() {
      let tree = loadFromNode(node);

      let names = [];
      for (let node of tree) {
        names.push(node.label.name);
      }

      expect(names, 'depth first, pre order').to.eql([
        'j','f','a','d','h','k','z'
      ]);
    });
  });
});
