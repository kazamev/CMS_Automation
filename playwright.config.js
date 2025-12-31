// const { devices } = require("@playwright/test");

// const config = {
//   testDir: "./tests",
//   timeout: 30 * 1000,
//   expect: {
//     timeout: 5000,
//   },

//   reporter: "html",
//   use: {
//     browserName: "chromium",
//     headless: false,
//   },
// };

// module.exports = config;


import { defineConfig, devices } from '@playwright/test';

export default defineConfig({

  testDir: './tests',
  timeout: 20*1000,
  expect: {
    timeout: 20000
  },
  fullyParallel: true,
  
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,

  workers: process.env.CI ? 1 : undefined,
  
  reporter: [
  ['html'],
  ['allure-playwright']
],
  
  use: {
   browserName: 'chromium',
    headless: false,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

  ],

 
});

