<img align="right" src="https://raw.github.com/cliffano/buildlight/master/avatar.jpg" alt="Avatar"/>

[![Build Status](https://secure.travis-ci.org/cliffano/buildlight.png?branch=master)](http://travis-ci.org/cliffano/buildlight)
[![Dependencies Status](https://david-dm.org/cliffano/buildlight.png)](http://david-dm.org/cliffano/buildlight)
[![Coverage Status](https://coveralls.io/repos/cliffano/buildlight/badge.png?branch=master)](https://coveralls.io/r/cliffano/buildlight?branch=master)
[![Published Version](https://badge.fury.io/js/buildlight.png)](http://badge.fury.io/js/buildlight)
<br/>
[![npm Badge](https://nodei.co/npm/buildlight.png)](http://npmjs.org/package/buildlight)

BuildLight
----------

BuildLight is a node.js library for [Delcom USB Visual Indicator](http://www.delcomproducts.com/products_usblmp.asp).

This is handy when you want to control Delcom build light device from node.js . It currently only supports Linux platform via usbled. Contributions for Windows and OS X are welcome.

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

* [Code complexity report](http://cliffano.github.io/buildlight/bob/complexity/plato/index.html)
* [Unit tests report](http://cliffano.github.io/buildlight/bob/test/buster.out)
* [Test coverage report](http://cliffano.github.io/buildlight/bob/coverage/buster-istanbul/lcov-report/lib/index.html)
* [Integration tests report](http://cliffano.github.io/buildlight/bob/test-integration/buster.out)
* [API Documentation](http://cliffano.github.io/buildlight/bob/doc/dox-foundation/index.html)