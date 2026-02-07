import { test as base, expect } from '@playwright/test';

export const test = base.extend({
  loggedInPage: async ({ page }, use) => {
  
    await use(page);

   
  },
});

export { expect };





