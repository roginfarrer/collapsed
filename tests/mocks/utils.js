const actualUtils = require.requireActual('../utils');

module.exports = Object.assign(actualUtils, {
  // eslint-disable-next-line no-undef
  getElementHeight: jest.fn(),
});
