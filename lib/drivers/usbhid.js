var hid = require('node-hid'),
  util = require('util');

/**
 * class UsbHid
 * UsbHid driver works by writing a colour data or off data to the device.
 *
 * Data values credit to https://github.com/ileitch/delcom_904008_driver/blob/master/delcom_904008.rb
 * Delcom USB HID doc https://www.delcomproducts.com/productdetails.asp?productnum=900000
 * Delcom Visual Indicator USB HID datasheet https://www.delcomproducts.com/downloads/USBVIHID.pdf
 */
function UsbHid() {
  var vendorId = 0x0fc5; // always 0x0FC5 for Delcom products
  var productId = 0xb080; // always 0xB080 for Delcom HID device
  this.device = this._find(vendorId, productId);

  this.dataMap = {
    off: '\x00',
    green: '\x01',
    red: '\x02',
    blue: '\x04',
    yellow: '\x04'
  };
}

/**
 * Switch on the specified colour by writing the colour data.
 *
 * @param {String} colour: the colour to switch on
 */
UsbHid.prototype.on = function (colour) {
  var data = this.dataMap[colour.toLowerCase()];
  this._write(data);
};

/**
 * Switch off the specified colour by writing an off data.
 * This is currently implemented as switching off all colours.
 *
 * @param {String} colour: the colour to switch off
 */
UsbHid.prototype.off = function (colour) {
  var data = this.dataMap.off;
  this._write(data);
};

/**
 * Synchronously write data to device.
 */
UsbHid.prototype._write = function (data) {
  this.device.write([0x21, 0x09, 0x0635, 0x000, util.format('\x65\x0C%s\xFF\x00\x00\x00\x00', data)]);
};

/**
 * Find device by matching vendor ID and product ID.
 * If there's no device found, then an error will be thrown.
 */
UsbHid.prototype._find = function (vendorId, productId) {
  var device;

  hid.devices().forEach(function (_device) {
    if (_device.vendorId === vendorId && _device.productId === productId) {
      device = new hid.HID(_device.path);
    }
  });

  if (device === undefined) {
    throw new Error('Unable to find build light device via USB HID');
  }

  return device;
};

module.exports = UsbHid;
