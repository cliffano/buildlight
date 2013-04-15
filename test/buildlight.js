var BuildLight = require('../lib/buildlight'),
  buster = require('buster'),
  UsbLed = require('../lib/drivers/usbled');

buster.testCase('buildlight - buildlight', {
  setUp: function () {
    this.stub(process, 'platform', 'linux');
    this.stub(UsbLed.prototype, '_find', function () {
      return '/some/usbled/path/';
    });
  },
  'should set default colour scheme to RGB': function () {
    var buildLight = new BuildLight();
    assert.equals(buildLight.scheme, [ 'red', 'green', 'blue' ]);
  },
  'should allow custom colour scheme': function () {
    var buildLight = new BuildLight({ scheme: [ 'cyan', 'magenta' ] });
    assert.equals(buildLight.scheme, [ 'cyan', 'magenta' ]);
  },
  'should set usbled driver when platform is linux': function () {
    var buildLight = new BuildLight({ scheme: [ 'cyan', 'magenta' ] });
    assert.isObject(buildLight.driver);
  },
  'should throw an error when platform is not supported': function (done) {
    this.stub(process, 'platform', 'someplatform');
    try {
      new BuildLight();
    } catch (e) {
      assert.equals(e.message, 'Unsupported platform someplatform');
      done();
    }
  },
  'should set colour methods based on colour scheme': function () {
    var buildLight = new BuildLight({ scheme: [ 'cyan', 'magenta' ] });
    assert.isFunction(buildLight.cyan);
    assert.isFunction(buildLight.magenta);
  }
});

buster.testCase('buildlight - on', {
  setUp: function () {
    this.stub(process, 'platform', 'linux');
    this.stub(UsbLed.prototype, '_find', function () {
      return '/some/usbled/path/';
    });
  },
  'should switch on all colours using specified driver': function (done) {
    var callCount = 0;
    this.stub(UsbLed.prototype, 'on', function (colour) {
      if (callCount === 0) {
        assert.equals(colour, 'red');
      } else {
        assert.equals(colour, 'blue');
        done();
      }
      callCount += 1;
    });
    var buildLight = new BuildLight({ scheme: [ 'red', 'blue' ]});
    buildLight.on();
  }
});

buster.testCase('buildlight - off', {
  setUp: function () {
    this.stub(process, 'platform', 'linux');
    this.stub(UsbLed.prototype, '_find', function () {
      return '/some/usbled/path/';
    });
  },
  'should switch off all colours using specified driver': function (done) {
    var callCount = 0;
    this.stub(UsbLed.prototype, 'off', function (colour) {
      if (callCount === 0) {
        assert.equals(colour, 'red');
      } else {
        assert.equals(colour, 'blue');
        done();
      }
      callCount += 1;
    });
    var buildLight = new BuildLight({ scheme: [ 'red', 'blue' ]});
    buildLight.off();
  }
});

buster.testCase('buildlight - colours', {
  setUp: function () {
    this.stub(process, 'platform', 'linux');
    this.stub(UsbLed.prototype, '_find', function () {
      return '/some/usbled/path/';
    });
  },
  'should switch off all colours in the scheme then switch on the selected colour': function (done) {
    var offCallCount = 0;
    this.stub(UsbLed.prototype, 'on', function (colour) {
      assert.equals(offCallCount, 1);
      assert.equals(colour, 'blue');
      done();
    });
    var buildLight = new BuildLight({ scheme: [ 'red', 'blue' ]});
    buildLight.off = function () {
      offCallCount += 1;
    };
    buildLight.blue();
  }
});