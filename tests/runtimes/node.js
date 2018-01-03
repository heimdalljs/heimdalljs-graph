import multidep from 'multidep';
const multidepRequire = multidep('tests/multidep.json');

import testGenerator from '../shared';

describe('heimdalljs-graph', function() {
  multidepRequire.forEachVersion('heimdalljs', function(version, _heimdall) {
    describe(`heimdalljs@${version}`, function() {
      // the entry point script _really_ should include a way to
      // access Heimdall itself (and not just the default session)
      let Heimdall = Object.getPrototypeOf(_heimdall).constructor;
      testGenerator(Heimdall, version);
    });
  });

  describe('loadFromFile', function() {
    it('works');
  });
});
