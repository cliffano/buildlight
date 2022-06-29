# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 1.0.0 - 2022-06-29
### Added
- Add device generation option

### Changed
- Replace async.whilst with async.forever in blink logic
- Change module type to ESM
- Set min node engine to >= 16.0.0
- Replace Travis CI with GH Actions
- Replace lint type from jshint to eslint
- Replace coverage from buster-istanbul to c8
- Replace doc type from dox-foundation to jsdoc

### Removed
- Remove usbhid driver

## 0.1.1 - 2015-06-21
### Changed
- Move optional platform override to constructor

## 0.1.0 - 2014-09-10
### Added
- Add optional platform override

### Changed
- Set min node engine to >= 0.10.0

## 0.0.5 - 2013-11-01
### Changed
- Change test lib to buster-node + referee
- Set min node engine to >= v0.8.0

## 0.0.4 - 2013-08-27
### Changed
- Unblink waits for interval to allow in-progress blink to finish
- Off no longer enforces unblink, client should control when to unblink

## 0.0.3 - 2013-08-27
### Changed
- Stop blinking when off is called

## 0.0.2 - 2013-06-28
### Added
- Add blink method

## 0.0.1 - 2013-04-16
### Added
- Initial version
