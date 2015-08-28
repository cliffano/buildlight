var buster = require('buster-node'),
  fs = require('fs'),
  hid = require('node-hid'),
  referee = require('referee'),
  UsbHid = require('../../lib/drivers/usbhid'),
  assert = referee.assert;

buster.testCase('usbhid - usbhid', {
  setUp: function () {
    this.mockHid = this.mock(hid);
  },
  'should set device when found': function () {
    var devices = [
      { vendorId: 0x0fc5, productId: 0xb080, path: 'somepath' }
    ];
    this.mockHid.expects('HID').once().withExactArgs('somepath').returns(devices[0]);
    this.mockHid.expects('devices').once().withExactArgs().returns(devices);
    var usbhid = new UsbHid();
    assert.equals(usbhid.device.vendorId, 0x0fc5);
    assert.equals(usbhid.device.productId, 0xb080);
    assert.equals(usbhid.device.path, 'somepath');
    assert.equals(usbhid.dataMap.off, '\x00');
    assert.equals(usbhid.dataMap.green, '\x01');
    assert.equals(usbhid.dataMap.red, '\x02');
    assert.equals(usbhid.dataMap.blue, '\x04');
    assert.equals(usbhid.dataMap.yellow, '\x04');
  },
  'should throw error when no device exists': function () {
    var devices = [
    ];
    this.mockHid.expects('devices').once().withExactArgs().returns(devices);
    try {
      new UsbHid();
    } catch (e) {
      assert.equals(e.message, 'Unable to find build light device via USB HID');
    }
  },
  'should throw error when no device matches': function () {
    var devices = [
      { vendorId: 0x0fc6, productId: 0xb081, path: 'somepath' }
    ];
    this.mockHid.expects('devices').once().withExactArgs().returns(devices);
    try {
      new UsbHid();
    } catch (e) {
      assert.equals(e.message, 'Unable to find build light device via USB HID');
    }
  }
});

buster.testCase('usbhid - on off', {
  setUp: function () {
    function mockWrite(data) {
    }
    var devices = [
      { vendorId: 0x0fc5, productId: 0xb080, path: 'somepath', write: mockWrite }
    ];

    this.mockHid = this.mock(hid);
    this.mockHid.expects('HID').once().withExactArgs('somepath').returns(devices[0]);
    this.mockHid.expects('devices').once().withExactArgs().returns(devices);

    this.usbHid = new UsbHid('/some/path');
  },
  'on should write correct data based on colour': function (done) {
    this.usbHid._write = function(data) {
      assert.equals(data, '\x02');
      done();
    };
    this.usbHid.on('red');
  },
  'off should write correct data based for switching off colours': function (done) {
    this.usbHid._write = function(data) {
      assert.equals(data, '\x00');
      done();
    };
    this.usbHid.off('red');
  },
  'write should write data to device': function () {
    this.usbHid._write('\x02');
  }
});
