// import { defineConfig, devices } from '@playwright/test';

// export default defineConfig({

//   testDir: './tests',
//   timeout: 50*1000,
//   expect: {
//     timeout: 50000
//   },
//   fullyParallel: false,
//   workers: 1,
//   globalSetup: require.resolve('./global-setup.js'),
//   //  testIgnore: [
//   //   '**/loginTest.spec.js' ,
//   //   '**/OrgListTest.spec.js'    //login tests should not run with storageState
//   // ],

//   forbidOnly: !!process.env.CI,
//   retries: process.env.CI ? 2 : 0,
//      reporter: [
//     ['list'],
//     ['allure-playwright'],
//     ['html', { open: 'never', outputFolder: 'extent-report' }]
//   ],

  
//   use: {
//    browserName: 'chromium',
//     headless: false,
//      storageState: 'storageState.json',
//     trace: 'on-first-retry',
//     screenshot: 'only-on-failure',
//     video: 'retain-on-failure',
//     permissions: [],
//   },

  
//   projects: [
//     {
//       name: 'chromium',
//       use: { ...devices['Desktop Chrome'] },
//     },

//     // {
//     //   name: 'firefox',
//     //   use: { ...devices['Desktop Firefox'] },
//     // },

//     // {
//     //   name: 'webkit',
//     //   use: { ...devices['Desktop Safari'] },
//     // },

//   ],

 
// });

import { defineConfig, devices } from '@playwright/test';
import path from 'path';

export default defineConfig({
  globalSetup: require.resolve('./global-setup.js'),
  testDir: './tests',
//    testIgnore: [
// '**/loginTest.spec.js' ,
    //login tests should not run with storageState
// ],
forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
     reporter: [
    ['list'],
    ['allure-playwright'],
    ['html', { open: 'never', outputFolder: 'extent-report' }]
  ],
  timeout: 60000,

  use: {
    headless: false,
    // Use the absolute path
    storageState: path.resolve(__dirname, 'storageState.json'),
    actionTimeout: 15000,
    navigationTimeout: 30000,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
     video: 'retain-on-failure',
 permissions: [],
  },
  // only 1 worker to prevent session clashing during debugging
  workers: 1, 
});