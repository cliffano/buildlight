# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Changed
- Replace lint type from jshint to eslint
- Replace coverage from buster-istanbul to c8
- Replace doc type from dox-foundation to jsdoc

### 0.1.2-pre
* Add usbhid driver
* Add device generation option
* Set min node engine to >= 4.0.0

### 0.1.1
* Move optional platform override to constructor

### 0.1.0
* Add optional platform override
* Set min node engine to >= 0.10.0

### 0.0.5
* Change test lib to buster-node + referee
* Set min node engine to >= v0.8.0 

### 0.0.4
* Unblink waits for interval to allow in-progress blink to finish
* Off no longer enforces unblink, client should control when to unblink

### 0.0.3
* Stop blinking when off is called

### 0.0.2
* Add blink method

### 0.0.1
* Initial version
