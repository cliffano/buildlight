/*jshint esnext: true */
function BuildLight(opts) {
  const RGB = [ 'red', 'green', 'blue' ];
  this.opts = opts || {};

  this.scheme = this.opts.scheme || RGB;
  this._driver();
  this._colours();
}

BuildLight.prototype.on = function () {
  var self = this;
  this.scheme.forEach(function (colour) {
    self.driver.on(colour);
  });
};

BuildLight.prototype.off = function () {
  var self = this;
  this.scheme.forEach(function (colour) {
    self.driver.off(colour);
  });
};

BuildLight.prototype._driver = function () {
  if (process.platform === 'linux') {
    this.driver = new (require('./drivers/usbled'))(this.opts.usbled);
  } else {
    throw new Error('Unsupported platform ' + process.platform);
  }
};

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