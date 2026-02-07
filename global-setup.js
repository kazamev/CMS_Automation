import { chromium } from '@playwright/test';
import { LoginPage } from './pages/loginPage';
import path from 'path';

export default async () => {
  console.log('Global Setup: Starting secure login');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  const login = new LoginPage(page);

  try {
    await login.goTo();
    await login.validLogin('shilpa@kazam.in', 'Shilpa@1234567890');

    await page.waitForURL('**/org', { timeout: 60000 });
    console.log('Select Organization page loaded');

    await page.click("text=Tyagi's Org");

    await page.waitForURL(/.*\/cpo|.*\/dashboard.*/, { timeout: 60000 });
    console.log('Organization selected, landed inside app');

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const storagePath = path.resolve(__dirname, 'storageState.json');
    await context.storageState({ path: storagePath });

    console.log(`Global Setup Success! State saved to: ${storagePath}`);
  } finally {
    await browser.close();
  }
};


