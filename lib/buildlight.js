/*jshint esnext: true */

/**
 *  class BuildLight
 * 
 * @param {Object} opts: optional
 * - scheme: color scheme array, defaults to [ 'red', 'green', 'blue' ]
 *           scheme allows flexibility to use BuildLight with various Delcom devices (RGB, RGY)
 */
function BuildLight(opts) {
  const RGB = [ 'red', 'green', 'blue' ];
  this.opts = opts || {};

  this.scheme = this.opts.scheme || RGB;
  this._driver();
  this._colours();
}

/**
 * Switch on all colours in the color scheme.
 */
BuildLight.prototype.on = function () {
  var self = this;
  this.scheme.forEach(function (colour) {
    self.driver.on(colour);
  });
};

/**
 * Switch off all colours in the color scheme.
 */
BuildLight.prototype.off = function () {
  var self = this;
  this.scheme.forEach(function (colour) {
    self.driver.off(colour);
  });
};

/**
 * Select a driver to use based on platform.
 * BuildLight currently supports Linux platform only, contributions for other platforms are welcome.
 * - Linux platform uses usbled driver.
 */
BuildLight.prototype._driver = function () {
  if (process.platform === 'linux') {
    this.driver = new (require('./drivers/usbled'))(this.opts.usbled);
  } else {
    throw new Error('Unsupported platform ' + process.platform);
  }
};

/**
 * Initialise colour method based on colour scheme.
 * If scheme is [ 'red', 'green', 'blue' ], then you use:
 * buildLight.red();
 * buildLight.green();
 * buildLight.blue();
 * Each colour method will switch off all colours, then switch on one particular colour.
 */
BuildLight.prototype._colours = function () {
  var self = this;
  this.scheme.forEach(function (colour) {
    BuildLight.prototype[colour] = function () {
      self.off();
      self.driver.on(colour);
    };
  });
};

module.exports = BuildLight;