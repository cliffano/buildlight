/*jshint esnext: true */
var fs = require('fs'),
  p = require('path');

function UsbLed(path) {
  this.path = path;
}

UsbLed.prototype.on = function (colour) {
  const ON = 1;
  fs.writeFileSync(p.join(this.path, colour.toLowerCase()), ON);
};

UsbLed.prototype.off = function (colour) {
  const OFF = 0;
  fs.writeFileSync(p.join(this.path, colour.toLowerCase()), OFF);
};

module.exports = UsbLed;
