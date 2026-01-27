// import { chromium } from '@playwright/test';
// import { LoginPage } from './pages/loginPage';

// export default async () => {
//   const browser = await chromium.launch({ headless: false });
//   const context = await browser.newContext();
//   const page = await context.newPage();

//   const login = new LoginPage(page);

//   await login.goTo();
//   await login.validLogin(
//     'shilpa@kazam.in',
//     'Shilpa@1234567890'
//   );

//   // IMPORTANT: wait for org landing, NOT /cpo
//   await page.waitForURL(/\/org/, { timeout: 60000 });

//   // Save login state
//   await context.storageState({ path: 'storageState.json' });

//   await browser.close();
// };

import { chromium } from '@playwright/test';
import { LoginPage } from './pages/loginPage';
import path from 'path';

export default async () => {
  console.log("Global Setup: Starting secure login");
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  const login = new LoginPage(page);


  try {
    await login.goTo();
    await login.validLogin('shilpa@kazam.in', 'Shilpa@1234567890');

    //Wait for URL to reach the dashboard area
    await page.waitForURL(/.*org.*/, { timeout: 60000 });
    console.log("URL detected. Waiting for network settlement");

    await page.waitForLoadState('networkidle');

   
    await page.goto("https://novo.kazam.in/org/Tyagi_Org/1b8d6bd0-22f5-4cd5-b794-1ce364573a30/cpo", {
        waitUntil: 'networkidle'
    });

 
    await page.waitForTimeout(5000);

    
    const storageState = await context.storageState();
    const cookieCount = storageState.cookies.length;
    const storageCount = storageState.origins[0]?.localStorage.length || 0;
    
    console.log(`Captured ${cookieCount} cookies and ${storageCount} storage items.`);

    if (cookieCount === 0 && storageCount === 0) {
        throw new Error("Failed to capture any session data.");
    }

    const storagePath = path.resolve(__dirname, 'storageState.json');
    await context.storageState({ path: storagePath });
    
    console.log(`Global Setup Success! State saved to: ${storagePath}`);

  } catch (error) {
    console.error("Global Setup Failed:", error.message);
    
    await page.screenshot({ path: 'setup-error-debug.png' });
    throw error;
  } finally {
    await browser.close();
  }
};