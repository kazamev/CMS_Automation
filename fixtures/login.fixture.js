import { test as base, expect } from '@playwright/test';

export const test = base.extend({
  loggedInPage: async ({ page }, use) => {
    //browser use stored cookies here
    await page.goto('https://novo.kazam.in/');
  
    await page.waitForTimeout(3000);

    //If we are login, the session wasn't accepted
    if (page.url().includes('login') || page.url().includes('auth')) {
       console.log("Login failed. Current URL: " + page.url());
       throw new Error("Session Injection Failed. Redirected to Login.");
    }
    await use(page);
  },
});

export { expect };