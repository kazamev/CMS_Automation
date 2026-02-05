import { defineConfig, devices } from '@playwright/test';
import path from 'path';

//ADD THIS LINE
import './Utils/console-capture.js';

export default defineConfig({
  globalSetup: require.resolve('./global-setup.js'),
  testDir: './tests',

  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,

  reporter: [
    ['list'],
    ['allure-playwright', {
      outputFolder: 'allure-results',
      detail: true,
      suiteTitle: true
    }],
    ['html', { open: 'never', outputFolder: 'extent-report' }],
    ['ortoni-report', { outputFolder: 'ortoni-report' }]
  ],

  timeout: 180000,

  use: {
    headless: false,
    storageState: path.resolve(__dirname, 'storageState.json'),
    actionTimeout: 80000,
    navigationTimeout: 90000,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    launchOptions: { slowMo: 1000 },
    permissions: []
  },

  workers: 1
});
