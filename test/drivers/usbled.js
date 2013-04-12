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
