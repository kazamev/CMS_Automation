import { test, expect } from '@playwright/test';
const { LoginPage } = require('../pages/loginPage');

// It overrides the global config and forces a clean, empty browser session
test.use({ storageState: { cookies: [], origins: [] } });

test('Valid Login', async ({ page }) => {
    const username="shilpa@kazam.in";
    const password="Shilpa@1234567890";
    const loginpage =new LoginPage(page);
    await loginpage.goTo();
    await loginpage.validLogin(username,password);
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL("https://novo.kazam.in/org");
    console.log("Login Successful, URL Verified");
    await page.waitForTimeout(3000);
  
});

test('Invalid Login Wrong Email', async ({ page }) => {
    const loginpage = new LoginPage(page);
    await loginpage.goTo();
    await loginpage.invalidLogin("wrongemail@kazam.in", "Shilpa@1234567890");
    await expect(loginpage.toastMessage).toBeVisible();
    console.log(await loginpage.toastMessage.textContent());
    await page.waitForTimeout(3000);
});

test('Invalid Login Wrong Password', async ({ page }) => {
    const loginpage = new LoginPage(page);
    await loginpage.goTo();
    await loginpage.invalidLogin("shilpa@kazam.in", "WrongPassword")
    await expect(loginpage.toastMessage).toBeVisible();
    console.log(await loginpage.toastMessage.textContent());
    await page.waitForTimeout(3000);
});

test('Invalid Login Empty Fields', async ({ page }) => {
    const loginpage = new LoginPage(page);
    await loginpage.goTo();
    await loginpage.invalidLogin("", "");
    // Assertion for validation message
    await expect(loginpage.error).toBeVisible();
    console.log(await loginpage.error.textContent());
    await page.waitForTimeout(3000);
});




