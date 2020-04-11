const actualUtils = require.requireActual('../../src/utils.ts');

Object.defineProperty(window, 'getComputedStyle', {
  value: jest.fn(),
});

module.exports = Object.assign(actualUtils, {
  // eslint-disable-next-line no-undef
  getElementHeight: jest.fn(),
});
