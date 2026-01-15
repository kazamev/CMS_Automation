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
  timeout: 40*1000,
  expect: {
    timeout: 40000
  },
  fullyParallel: false,
  workers: 1,

  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
     reporter: [
    ['list'],
    ['allure-playwright'],
    ['html', { open: 'never', outputFolder: 'extent-report' }]
  ],

  
  use: {
   browserName: 'chromium',
    headless: true,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    permissions: [],
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

