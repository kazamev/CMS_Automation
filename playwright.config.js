const { devices } = require("@playwright/test");

const config = {
  testDir: "./tests",
  timeout: 500 * 1000,
  expect: {
    timeout: 500000,
  },

  reporter: "html",
  use: {
    browserName: "chromium",
    headless: false,
    channel: 'chrome',  // Specify the full Chrome browser
  },
};

module.exports = config;
