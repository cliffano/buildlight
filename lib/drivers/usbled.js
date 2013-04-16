/*jshint esnext: true */
var fs = require('fs'),
  p = require('path');

/**
 * class UsbLed
 * usbled driver works by writing a file containing 1 (ON) or 0 (OFF) with
 * the colour as the file name, the file must be written to driver path.
 *
 * @param {String} path: usbled driver path, if not specified then it will try
 *                       to find driver path under /sys/bus/usb/drivers/usbled/ .
 */
function UsbLed(path) {
  this.path = path || this._find();
}

/**
 * Switch on the specified colour by writing a colour file containing value 1.
 *
 * @param {String} colour: the colour to switch on
 */
UsbLed.prototype.on = function (colour) {
  const ON = 1;
  fs.writeFileSync(p.join(this.path, colour.toLowerCase()), ON);
};

/**
 * Switch off the specified colour by writing a colour file containing value 0.
 *
 * @param {String} colour: the colour to switch off
 */
UsbLed.prototype.off = function (colour) {
  const OFF = 0;
  fs.writeFileSync(p.join(this.path, colour.toLowerCase()), OFF);
};

/**
 * Find usbled driver path under /sys/bus/usb/drivers/usbled/.
 * If there are multiple versions installed, then it will pick the largest version number.
 * If there's only one version installed, that version will be used.
 * If there's none or if usbled is not installed, then an error will be thrown.
 */
UsbLed.prototype._find = function () {
  const DIR = '/sys/bus/usb/drivers/usbled/';

  if (!fs.existsSync(DIR)) {
    throw new Error('Unable to find USB LED driver installation.');
  }

  var versions = fs.readdirSync(DIR).filter(function (dir) {
    return dir.match(/.+:.+/);
  });

  if (versions.length === 0) {
    throw new Error('Unable to find USB LED driver installation.');
  }

  if (versions.length > 1) {
    versions.sort(function (v1, v2) {
      return v1 < v2;
    });
  }
  return p.join(DIR, versions[0]);
};

module.exports = UsbLed;
