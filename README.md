<img align="right" src="https://raw.github.com/cliffano/buildlight/master/avatar.jpg" alt="Avatar"/>

[![Build Status](https://secure.travis-ci.org/cliffano/buildlight.png?branch=master)](http://travis-ci.org/cliffano/buildlight)
[![Dependencies Status](https://david-dm.org/cliffano/buildlight.png)](http://david-dm.org/cliffano/buildlight)
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

    // blinks with red colour then switch on green when unblink is called 5 seconds later
    buildLight.blink('red', function (err) {
      if (!err) {
        buildLight.green();
      }
    });
    setTimeout(function () {
      buildLight.unblink();
    }, 5000);
