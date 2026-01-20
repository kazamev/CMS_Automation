import { chromium } from '@playwright/test';
import { LoginPage } from './pages/loginPage.js';

export default async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

 

  const login = new LoginPage(page);

  await login.goTo();
  await login.validLogin("shilpa@kazam.in", "Shilpa@1234567890");

  // ✅ Correct wait
  await page.waitForURL(/\/org/, { timeout: 20000 });
  // Ensure dashboard is loaded
  

  // Save authenticated session
  await context.storageState({ path: 'storageState.json' });

  await browser.close();
};
