<img align="right" src="https://raw.github.com/cliffano/buildlight/master/avatar.jpg" alt="Avatar"/>

[![Build Status](https://img.shields.io/travis/cliffano/buildlight.svg)](http://travis-ci.org/cliffano/buildlight)
[![Dependencies Status](https://img.shields.io/david/cliffano/buildlight.svg)](http://david-dm.org/cliffano/buildlight)
[![Coverage Status](https://img.shields.io/coveralls/cliffano/buildlight.svg)](https://coveralls.io/r/cliffano/buildlight?branch=master)
[![Published Version](https://img.shields.io/npm/v/buildlight.svg)](http://www.npmjs.com/package/buildlight)
<br/>
[![npm Badge](https://nodei.co/npm/buildlight.png)](http://npmjs.org/package/buildlight)

BuildLight
----------

BuildLight is a node.js library for [Delcom USB Visual Indicator](http://www.delcomproducts.com/products_usblmp.asp).

This is handy when you want to control Delcom build light device from node.js . It currently only supports Linux platform via usbled and OS X via usbhid. Contributions for Windows are welcome.

Installation
------------

    npm install buildlight

Usage
-----

    var BuildLight = require('buildlight'),
      buildLight = new BuildLight();

    // switch on all colours
    buildLight.on();

    // switch off all colours
    buildLight.off();

    // switch on one colour
    buildLight.red();
    buildLight.green();
    buildLight.blue();

    // to use custom colour scheme
    buildLight = new BuildLight({ scheme: ['red', 'green', 'yellow'] });
    buildLight.yellow();

    // blinks with green colour then switch on blue when unblink is called 5 seconds later
    buildLight.blink('green', function (err) {
      if (err) {
        buildLight.red();
      }
    });
    setTimeout(function () {
      buildLight.unblink(function () {
        buildLight.blue();
      });
    }, 5000);

Colophon
--------

[Developer's Guide](http://cliffano.github.io/developers_guide.html#nodejs)

Build reports:

* [Code complexity report](http://cliffano.github.io/buildlight/complexity/plato/index.html)
* [Unit tests report](http://cliffano.github.io/buildlight/test/buster.out)
* [Test coverage report](http://cliffano.github.io/buildlight/coverage/buster-istanbul/lcov-report/lib/index.html)
* [Integration tests report](http://cliffano.github.io/buildlight/test-integration/buster.out)
* [API Documentation](http://cliffano.github.io/buildlight/doc/dox-foundation/index.html)
