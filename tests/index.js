import chai from 'chai';
import Heimdall from 'heimdalljs/heimdall';
import { loadFromNode } from '../src';

const { expect } = chai;

describe('heimdalljs-tree', function() {

  describe('.loadFromNode', function() {
    let node;

    class StatsSchema {
      constructor() {
        this.x = 0;
        this.y = 0;
      }
    }

    beforeEach( function() {
      let heimdall = new Heimdall();

      // a
      // ├── b1
      // │   └── c1
      // └── b2
      //     ├── c2
      //     └── c3
      heimdall.registerMonitor('mystats', StatsSchema);
      let a = heimdall.start('a');
      let b1 = heimdall.start({ name: 'b1', broccoliNode: true });
      let c1 = heimdall.start('c1');
      heimdall.statsFor('mystats').x = 3;
      heimdall.statsFor('mystats').y = 4;
      c1.stop();
      b1.stop();
      let b2 = heimdall.start('b2');
      let c2 = heimdall.start({ name: 'c2', broccoliNode: true });
      c2.stop();
      let c3 = heimdall.start('c3');
      c3.stop();
      b2.stop();
      a.stop();

      let node = heimdall.root._children[0];
    });

    it('loads without error', function() {
      expect(() => {
        loadFromNode(node);
      }).to.not.throw;
    });
  });
});
