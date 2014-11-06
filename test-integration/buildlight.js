var BuildLight = require('../lib/buildlight'),
  buster = require('buster-node'),
  referee = require('referee'),
  assert = referee.assert;

buster.testCase('buildlight - buildlight', {
  setUp: function () {
    this.mock({});
  },
  'should throw error when platform is not supported or usbled is not available, otherwise return buildlight': function () {
    try {
      var buildLight = new BuildLight();
      assert.defined(buildLight);
    } catch (err) {
      assert.isTrue(err.message.match(/[Unsupported platform | Unable to find USB LED driver installation]/) !== undefined);
    }
  }
});
