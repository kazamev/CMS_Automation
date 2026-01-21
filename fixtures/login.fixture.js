// import { test as base } from '@playwright/test';
// import { LoginPage } from '../pages/loginPage';

// export const test = base.extend({
//   loggedInPage: async ({ page }, use) => {
//     const login = new LoginPage(page);
//     await login.goTo();
//     await login.validLogin("bshilpa747@gmail.com", "Shilpa@1234567890");

//     // Wait for login to fully finish
//     await page.waitForLoadState("networkidle");

//     // Don't navigate to a specific page here
//     await use(page);
//   }
// });

// export const expect = base.expect;


// fixtures/login.fixture.js
import { test as base, expect } from '@playwright/test';

export const test = base.extend({
  loggedInPage: async ({ page }, use) => {
    // The browser will automatically use the storageState.json cookies here
    await page.goto('https://novo.kazam.in/');
    
    await page.waitForTimeout(3000);

    //If we are on /login, the session wasn't accepted
    if (page.url().includes('login') || page.url().includes('auth')) {
       console.log("Login failed. Current URL: " + page.url());
       throw new Error("Session Injection Failed. Redirected to Login.");
    }

    //If all good, pass the page to the test
    await use(page);
  },
});

export { expect };