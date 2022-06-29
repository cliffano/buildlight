<img align="right" src="https://raw.github.com/cliffano/buildlight/master/avatar.jpg" alt="Avatar"/>

[![Build Status](https://github.com/cliffano/buildlight/workflows/CI/badge.svg)](https://github.com/cliffano/buildlight/actions?query=workflow%3ACI)
[![Vulnerabilities Status](https://snyk.io/test/github/cliffano/buildlight/badge.svg)](https://snyk.io/test/github/cliffano/buildlight)
[![Dependencies Status](https://img.shields.io/david/cliffano/buildlight.svg)](http://david-dm.org/cliffano/buildlight)
[![Coverage Status](https://img.shields.io/coveralls/cliffano/buildlight.svg)](https://coveralls.io/r/cliffano/buildlight?branch=master)
[![Published Version](https://img.shields.io/npm/v/buildlight.svg)](http://www.npmjs.com/package/buildlight)
<br/>

BuildLight
----------

BuildLight is a node.js library for [Delcom USB Visual Indicator](http://www.delcomproducts.com/products_usblmp.asp).

This is handy when you want to control Delcom build light device from node.js . It currently only supports Linux platform with device generation 1 via usbled.

Installation
------------

    npm install buildlight

Usage
-----

    import BuildLight from '../lib/buildlight.js';
    const buildLight = new BuildLight();

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
* [Unit tests report](http://cliffano.github.io/buildlight/test/mocha.txt)
* [Test coverage report](http://cliffano.github.io/buildlight/coverage/c8/index.html)
* [Integration tests report](http://cliffano.github.io/buildlight/test-integration/mocha.txt)
* [API Documentation](http://cliffano.github.io/buildlight/doc/jsdoc/index.html)
