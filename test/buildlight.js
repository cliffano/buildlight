"use strict"
/* eslint no-unused-vars: 0 */
import BuildLight from '../lib/buildlight.js';
import UsbLed from '../lib/drivers/usbled.js';
import referee from '@sinonjs/referee';
import sinon from 'sinon';
const assert = referee.assert;

describe('buildlight - buildlight', function () {
  beforeEach(function () {
    this.usbLedFindStub = sinon.stub(UsbLed.prototype, '_find').value(function () {
      return '/some/usbled/path/';
    });
  });
  afterEach(function () {
    sinon.verify();
    sinon.restore();
  });
  it('should set default colour scheme to RGB', function () {
    const buildLight = new BuildLight({ platform: 'linux' });
    assert.equals(buildLight.scheme, [ 'red', 'green', 'blue' ]);
  });
  it('should allow custom colour scheme', function () {
    const buildLight = new BuildLight({ platform: 'linux', scheme: [ 'cyan', 'magenta' ] });
    assert.equals(buildLight.scheme, [ 'cyan', 'magenta' ]);
  });
  it('should set usbled driver when platform is linux', function () {
    const buildLight = new BuildLight({ platform: 'linux', scheme: [ 'cyan', 'magenta' ] });
    assert.isObject(buildLight.driver);
  });
  it('should throw an error when platform is not supported', function (done) {
    try {
      new BuildLight({ platform: 'someplatform' });
    } catch (e) {
      assert.equals(e.message, 'Unsupported platform someplatform with device generation 1');
      done();
    }
  });
  it('should set colour methods based on colour scheme', function () {
    const buildLight = new BuildLight({ platform: 'linux', scheme: [ 'cyan', 'magenta' ] });
    assert.isFunction(buildLight.cyan);
    assert.isFunction(buildLight.magenta);
  });
  it('should set default opts', function () {
    const buildLightDriver = sinon.stub(BuildLight.prototype, '_driver').value(function () {});
    const buildLightColours = sinon.stub(BuildLight.prototype, '_colours').value(function () {});
    const buildLight = new BuildLight();
    assert.isObject(buildLight.scheme);
    assert.isNumber(buildLight.interval);
    assert.isString(buildLight.platform);
    assert.isNumber(buildLight.gen);
    buildLightDriver.restore();
    buildLightColours.restore();
  });
  it('should set custom interval if specified', function () {
    const buildLight = new BuildLight({ platform: 'linux', interval: 123 });
    assert.equals(buildLight.interval, 123);
  });
});

describe('buildlight - on', function () {
  beforeEach(function () {
    this.usbLedFindStub = sinon.stub(UsbLed.prototype, '_find').value(function () {
      return '/some/usbled/path/';
    });
  });
  afterEach(function () {
    sinon.verify();
    sinon.restore();
  });
  it('should switch on all colours using specified driver', function (done) {
    let callCount = 0;
    const self = this;
    this.usbLedOnStub = sinon.stub(UsbLed.prototype, 'on').value(function (colour) {
      if (callCount === 0) {
        assert.equals(colour, 'red');
      } else {
        assert.equals(colour, 'blue');
        self.usbLedOnStub.restore();
        done();
      }
      callCount += 1;
    });
    const buildLight = new BuildLight({ platform: 'linux', scheme: [ 'red', 'blue' ] });
    buildLight.on();
  });
});

describe('buildlight - off', function () {
  beforeEach(function () {
    this.usbLedFindStub = sinon.stub(UsbLed.prototype, '_find').value(function () {
      return '/some/usbled/path/';
    });
  });
  afterEach(function () {
    sinon.verify();
    sinon.restore();
  });
  it('should switch off all colours using specified driver', function (done) {
    let callCount = 0;
    const self = this;
    this.usbLedOffStub = sinon.stub(UsbLed.prototype, 'off').value(function (colour) {
      if (callCount === 0) {
        assert.equals(colour, 'red');
      } else {
        assert.equals(colour, 'blue');
        self.usbLedOffStub.restore();
        done();
      }
      callCount += 1;
    });
    const buildLight = new BuildLight({ platform: 'linux', scheme: [ 'red', 'blue' ] });
    buildLight.off();
  });
});

describe('buildlight - colours', function () {
  beforeEach(function () {
    this.usbLedFindStub = sinon.stub(UsbLed.prototype, '_find').value(function () {
      return '/some/usbled/path/';
    });
  });
  afterEach(function () {
    sinon.verify();
    sinon.restore();
  });
  it('should switch off all colours in the scheme then switch on the selected colour', function (done) {
    let offCallCount = 0;
    const self = this;
    this.usbLedOnStub = sinon.stub(UsbLed.prototype, 'on').value(function (colour) {
      assert.equals(offCallCount, 1);
      assert.equals(colour, 'blue');
      self.usbLedOnStub.restore();
      done();
    });
    const buildLight = new BuildLight({ platform: 'linux', scheme: [ 'red', 'blue' ] });
    buildLight.off = function () {
      offCallCount += 1;
    };
    buildLight.blue();
  });
});

describe('buildlight - blink', async function () {
  beforeEach(function () {
    this.usbLedFindStub = sinon.stub(UsbLed.prototype, '_find').value(function () {
      return '/some/usbled/path/';
    });
    this.buildLight = new BuildLight({ platform: 'linux', interval: 0 });
  });
  afterEach(function () {
    sinon.verify();
    sinon.restore();
  });
  it('should set switch specified colour on then off after unblink is called', function (done) {
    const self = this;
    this.buildLight.red = sinon.stub();
    this.buildLight.off = sinon.stub();
    this.buildLight.blink('red', function (err) {
      assert.equals(self.buildLight.red.callCount, 1);
      assert.equals(self.buildLight.off.callCount, 1);
      done();
    });
    setTimeout(function () {
      self.buildLight.unblink(function () {});
    }, 0);
  });
  it('should set switch all colours on then off after unblink is called', function (done) {
    this.timeout = 500;
    const self = this;
    this.buildLight.on = sinon.stub();
    this.buildLight.off = sinon.stub();
    this.buildLight.blink(function (err) {
      assert.equals(self.buildLight.on.callCount, 1);
      assert.equals(self.buildLight.off.callCount, 1);
      done();
    });
    setTimeout(function () {
      self.buildLight.unblink(function () {});
    }, 0);
  });
});

describe('buildlight - unblink', function () {
  beforeEach(function () {
    this.usbLedFindStub = sinon.stub(UsbLed.prototype, '_find').value(function () {
      return '/some/usbled/path/';
    });
  });
  afterEach(function () {
    sinon.verify();
    sinon.restore();
  });
  it('should set continuous to false', function (done) {
    const buildLight = new BuildLight({ platform: 'linux', interval: 1 });
    buildLight.unblink(function () {
      assert.isFalse(buildLight.continuous);
      done();
    });
  });
});
