/* eslint-disable @typescript-eslint/no-var-requires */
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },
  video: false,
  screenshotOnRunFailure: false,
});
