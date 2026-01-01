import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';

export const test = base.extend({
  loggedInPage: async ({ page }, use) => {
    const login = new LoginPage(page);
    await login.goTo();
    await login.validLogin("shilpa@kazam.in", "Shilpa@1234567890");

    // Wait for login to fully finish
    await page.waitForLoadState("networkidle");

    // Don't navigate to a specific page here
    await use(page);
  }
});

export const expect = base.expect;
