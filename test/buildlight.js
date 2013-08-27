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
  },
  'should set default interval': function () {
    var buildLight = new BuildLight();
    assert.isNumber(buildLight.interval);
  },
  'should set custom interval if specified': function () {
    var buildLight = new BuildLight({ interval: 123 });
    assert.equals(buildLight.interval, 123);
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

buster.testCase('buildlight - blink', {
  setUp: function () {
    this.stub(process, 'platform', 'linux');
    this.stub(UsbLed.prototype, '_find', function () {
      return '/some/usbled/path/';
    });
    this.buildLight = new BuildLight({ interval: 0 });
  },
  'should set switch specified colour on then off after unblink is called': function (done) {
    this.timeout = 500;
    var self = this;
    this.buildLight.red = this.stub();
    this.buildLight.off = this.stub();
    this.buildLight.blink('red', function (err) {
      assert.equals(self.buildLight.red.callCount, 1);
      assert.equals(self.buildLight.off.callCount, 1);
      done();
    });
    setTimeout(function () {
      self.buildLight.unblink();
    }, 0);
  },
  'should set switch all colours on then off after unblink is called': function (done) {
    this.timeout = 500;
    var self = this;
    this.buildLight.on = this.stub();
    this.buildLight.off = this.stub();
    this.buildLight.blink(function (err) {
      assert.equals(self.buildLight.on.callCount, 1);
      assert.equals(self.buildLight.off.callCount, 1);
      done();
    });
    setTimeout(function () {
      self.buildLight.unblink();
    }, 0);
  }
});

buster.testCase('buildlight - unblink', {
  setUp: function () {
    this.stub(process, 'platform', 'linux');
    this.stub(UsbLed.prototype, '_find', function () {
      return '/some/usbled/path/';
    });
  },
  'should set continuous to false': function () {
    var buildLight = new BuildLight();
    buildLight.unblink();
    assert.isFalse(buildLight.continuous);
  }
});
