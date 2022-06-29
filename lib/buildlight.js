"use strict"
import async from 'async';
import UsbLed from './drivers/usbled.js';

/**
 *  class BuildLight
 *
 * @param {Object} opts: optional
 * - scheme: color scheme array, defaults to [ 'red', 'green', 'blue' ]
 *           scheme allows flexibility to use BuildLight with various Delcom devices (RGB, RGY)
 * - usbled: path to usbled installation, if not specified then it will try to
 *           find a usbled installation at /sys/bus/usb/drivers/usbled/
 * - interval: continuous task (e.g. blink) interval in milliseconds
 *             switching between displaying color and no color, default to 500ms
 * - gen: generation number of the build light
 *        find the part number at the bottom of your device
 *        and check it at Delcom product page https://www.delcomproducts.com/products_USBLMP.asp
 */
class BuildLight {
  
  constructor(opts) {
    const RGB = [ 'red', 'green', 'blue' ];
    const INTERVAL = 500;
    const GEN = 1;

    this.opts = opts || {};
    this.scheme = this.opts.scheme || RGB;
    this.interval = this.opts.interval || INTERVAL;
    this.platform = this.opts.platform || process.platform;
    this.gen = this.opts.gen || GEN;

    this._driver();
    this._colours();
  }

  /**
   * Switch on all colours in the color scheme.
   */
  on() {
    var self = this;
    this.scheme.forEach(function (colour) {
      self.driver.on(colour);
    });
  }

  /**
   * Switch off all colours in the color scheme.
   */
  off() {
    var self = this;
    this.scheme.forEach(function (colour) {
      self.driver.off(colour);
    });
  }

  /**
   * Blink the specified colour.
   *
   * @param {String} colour: a colour from the scheme, default scheme either red, green, or blue
   *   if no colour is specified then default to display all colours from the scheme
   * @param {Function} cb: callback with error arg if there's any interruption
   */
  blink(colour, cb) {
    if (!cb) {
      cb = colour;
      colour = null;
    }

    var self = this;
    this.continuous = true;

    function task(cb) {

      // only timeout if continuous, otherwise finish off a.s.a.p
      function _do(cb) {
        if (self.continuous) {
          setTimeout(cb, self.interval);
        } else {
          cb();
        }
      }

      if (self.continuous) {

        self[colour || 'on']();
        _do(function () {
          self.off();
          _do(cb);
        });

      } else {
        cb('Stop blinking...');
      }
    }

    async.forever(task, cb);
  }

  /**
   * Stop blinking.
   * Wait for interval before calling callback to allow
   * in-progress blink to finish.
   *
   * @param {Function} cb: callback with error arg if there's any interruption
   */
  unblink(cb) {
    this.continuous = false;
    setTimeout(cb, this.interval);
  }

  /**
   * Select a driver to use based on platform.
   * BuildLight currently supports Linux platform only, contributions for other platforms are welcome.
   * - Linux platform uses usbled driver.
   */
  _driver() {
    if (this.platform === 'linux' && this.gen === 1) {
      this.driver = new (UsbLed)(this.opts.usbled);
    } else {
      throw new Error('Unsupported platform ' + this.platform + ' with device generation ' + this.gen);
    }
  }

  /**
   * Initialise colour method based on colour scheme.
   * If scheme is [ 'red', 'green', 'blue' ], then you use:
   * buildLight.red();
   * buildLight.green();
   * buildLight.blue();
   * Each colour method will switch off all colours, then switch on one particular colour.
   */
  _colours() {
    var self = this;
    this.scheme.forEach(function (colour) {
      BuildLight.prototype[colour] = function () {
        self.off();
        self.driver.on(colour);
      };
    });
  }

}

export {
  BuildLight as default
};

