"use strict"
/* eslint no-unused-vars: 0 */
import fs from 'fs';
import UsbLed from '../../lib/drivers/usbled.js';
import referee from '@sinonjs/referee';
import sinon from 'sinon';
const assert = referee.assert;

describe('usbled - usbled', function() {
  beforeEach(function () {
    this.mockFs = sinon.mock(fs);
  });
  afterEach(function () {
    sinon.verify();
    sinon.restore();
  });
  it('should set path', function () {
    const usbled = new UsbLed('/some/path');
    assert.equals(usbled.path, '/some/path');
  });
});

describe('usbled - on', function() {
  beforeEach(function () {
    this.mockFs = sinon.mock(fs);
  });
  afterEach(function () {
    sinon.verify();
    sinon.restore();
  });
  it('should write 1 to colour file', function () {
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/path/red', '1');
    new UsbLed('/some/path').on('red'); 
  });
  it('should handle case insensitive colours', function () {
    this.mockFs.expects('writeFileSync').twice().withExactArgs('/some/path/red', '1');
    const usbled = new UsbLed('/some/path');
    usbled.on('RED');
    usbled.on('rEd');
  });
});

describe('usbled - off', function() {
  beforeEach(function () {
    this.mockFs = sinon.mock(fs);
  });
  afterEach(function () {
    sinon.verify();
    sinon.restore();
  });
  it('should write 0 to colour file', function () {
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/path/red', '0');
    new UsbLed('/some/path').off('red'); 
  });
  it('should handle case insensitive colours', function () {
    this.mockFs.expects('writeFileSync').twice().withExactArgs('/some/path/red', '0');
    const usbled = new UsbLed('/some/path');
    usbled.off('RED');
    usbled.off('rEd');
  });
});

describe('usbled - _find', function() {
  beforeEach(function () {
    this.mockFs = sinon.mock(fs);
  });
  afterEach(function () {
    sinon.verify();
    sinon.restore();
  });
  it('should return path when there is only one version of usbled installed', function () {
    this.mockFs.expects('existsSync').once().withExactArgs('/sys/bus/usb/drivers/usbled/').returns(true);
    this.mockFs.expects('readdirSync').once().withExactArgs('/sys/bus/usb/drivers/usbled/').returns(['2-1.8:1.0']);    
    this.usbLed = new UsbLed();
    assert.equals(this.usbLed.path, '/sys/bus/usb/drivers/usbled/2-1.8:1.0');
  });
  it('should return path with newer version when there are multiple versions of usbled installed', function () {
    this.mockFs.expects('existsSync').once().withExactArgs('/sys/bus/usb/drivers/usbled/').returns(true);
    this.mockFs.expects('readdirSync').once().withExactArgs('/sys/bus/usb/drivers/usbled/').returns(['2-1.8:1.0', 'bind', '2-0.1:2.3']);
    this.usbLed = new UsbLed();
    assert.equals(this.usbLed.path, '/sys/bus/usb/drivers/usbled/2-1.8:1.0');
  });
  it('should throw an error when usbled exists but there is no version', function (done) {
    this.mockFs.expects('existsSync').once().withExactArgs('/sys/bus/usb/drivers/usbled/').returns(true);
    this.mockFs.expects('readdirSync').once().withExactArgs('/sys/bus/usb/drivers/usbled/').returns([]);
    try {
      new UsbLed();
    } catch (e) {
      assert.equals(e.message, 'Unable to find USB LED driver installation.');
      done();
    }
  });
  it('should throw an error when there is no usbled version installed', function (done) {
    this.mockFs.expects('existsSync').once().withExactArgs('/sys/bus/usb/drivers/usbled/').returns(true);
    this.mockFs.expects('readdirSync').once().withExactArgs('/sys/bus/usb/drivers/usbled/').returns(['bind', 'uevent', 'unbind']);
    try {
      new UsbLed();
    } catch (e) {
      assert.equals(e.message, 'Unable to find USB LED driver installation.');
      done();
    }
  });
  it('should throw an error when usbled base directory does not exist', function (done) {
    this.mockFs.expects('existsSync').once().withExactArgs('/sys/bus/usb/drivers/usbled/').returns(false);
    try {
      new UsbLed();
    } catch (e) {
      assert.equals(e.message, 'Unable to find USB LED driver installation.');
      done();
    }
  });
});
