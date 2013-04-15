var buster = require('buster'),
  fs = require('fs'),
  UsbLed = require('../../lib/drivers/usbled');

buster.testCase('usbled - usbled', {
  setUp: function () {
    this.mockFs = this.mock(fs);
  },
  'should set path': function () {
    var usbled = new UsbLed('/some/path');
    assert.equals(usbled.path, '/some/path');
  }
});

buster.testCase('usbled - on', {
  setUp: function () {
    this.mockFs = this.mock(fs);
  },
  'should write 1 to colour file': function () {
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/path/red', 1);
    new UsbLed('/some/path').on('red'); 
  },
  'should handle case insensitive colours': function () {
    this.mockFs.expects('writeFileSync').twice().withExactArgs('/some/path/red', 1);
    var usbled = new UsbLed('/some/path');
    usbled.on('RED');
    usbled.on('rEd');
  }
});

buster.testCase('usbled - off', {
  setUp: function () {
    this.mockFs = this.mock(fs);
  },
  'should write 0 to colour file': function () {
    this.mockFs.expects('writeFileSync').once().withExactArgs('/some/path/red', 0);
    new UsbLed('/some/path').off('red'); 
  },
  'should handle case insensitive colours': function () {
    this.mockFs.expects('writeFileSync').twice().withExactArgs('/some/path/red', 0);
    var usbled = new UsbLed('/some/path');
    usbled.off('RED');
    usbled.off('rEd');
  }
});

buster.testCase('usbled - _find', {
  setUp: function () {
    this.mockFs = this.mock(fs);
  },
  'should return path when there is only one version of usbled installed': function () {
    this.mockFs.expects('existsSync').once().withExactArgs('/sys/bus/usb/drivers/usbled/').returns(true);
    this.mockFs.expects('readdirSync').once().withExactArgs('/sys/bus/usb/drivers/usbled/').returns(['2-1.8:1.0']);    
    this.usbLed = new UsbLed();
    assert.equals(this.usbLed.path, '/sys/bus/usb/drivers/usbled/2-1.8:1.0');
  },
  'should return path with newer version when there are multiple versions of usbled installed': function () {
    this.mockFs.expects('existsSync').once().withExactArgs('/sys/bus/usb/drivers/usbled/').returns(true);
    this.mockFs.expects('readdirSync').once().withExactArgs('/sys/bus/usb/drivers/usbled/').returns(['2-1.8:1.0', '2-0.1:2.3']);
    this.usbLed = new UsbLed();
    assert.equals(this.usbLed.path, '/sys/bus/usb/drivers/usbled/2-1.8:1.0');
  },
  'should throw an error when there is no usbled version installed': function (done) {
    this.mockFs.expects('existsSync').once().withExactArgs('/sys/bus/usb/drivers/usbled/').returns(true);
    this.mockFs.expects('readdirSync').once().withExactArgs('/sys/bus/usb/drivers/usbled/').returns([]);
    try {
      new UsbLed();
    } catch (e) {
      assert.equals(e.message, 'Unable to find USB LED driver installation.');
      done();
    }
  },
  'should throw an error when usbled base directory does not exist': function (done) {
    this.mockFs.expects('existsSync').once().withExactArgs('/sys/bus/usb/drivers/usbled/').returns(false);
    try {
      new UsbLed();
    } catch (e) {
      assert.equals(e.message, 'Unable to find USB LED driver installation.');
      done();
    }
  }
});
