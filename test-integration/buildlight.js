"use strict"
/* eslint no-unused-vars: 0 */
import BuildLight from '../lib/buildlight.js';
import referee from '@sinonjs/referee';
import sinon from 'sinon';
const assert = referee.assert;

describe('buildlight - buildlight', function () {
  it('should throw error when platform is not supported or usbled is not available, otherwise return buildlight', function () {
    try {
      const buildLight = new BuildLight();
      assert.defined(buildLight);
    } catch (err) {
      assert.isTrue(err.message.match(/[Unsupported platform | Unable to find USB LED driver installation]/) !== undefined);
    }
  });
});
