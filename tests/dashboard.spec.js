const { test } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const DashboardPage = require('../pages/DashboardPage');
const { chromium } = require('playwright'); 
const path = require('path');

let context;
let page;

// Define DashboardValidation as an async function
const DashboardValidation = async () => {
    let dashboardValue,dashboardUsageValue;
    // First test for login setup
    test('Login and navigate to Nikol EV', async ({ browser }) => {
        // Launch a new browser context and page
        context = await browser.newContext(); // Create a new context
        page = await context.newPage(); // Open a new page

        // Initialize the login page
        const loginPage = new LoginPage(page);

        // Perform the login
        await loginPage.gotoLoginPage();
        await loginPage.login('akhilesh@kazam.in', 'Akbl@1724');
        await loginPage.selectNikolEv();

        // Save the logged-in state (optional, useful for debugging)
        await context.storageState({ path: 'logged-in-state.json' });
        await page.waitForTimeout(10000);
    });

    // Second test for dashboard validation
    test('Dashboard validation', async () => {
        // Initialize the DashboardPage with the page instance
    const dashboardPage = new DashboardPage(page);
    await page.waitForTimeout(5000)

    // Get and print dashboard session value
    dashboardValue = await dashboardPage.getDashboardValue();
    await page.waitForTimeout(2000);
    console.log(`Total no of sessions(From Dashboard): ${dashboardValue}`);
    await page.waitForTimeout(2000);

    // Get and print dashboard usage value
    dashboardUsageValue = await dashboardPage.getDashboardUsageValue();
    console.log(`Total Usage (From Dashboard In kWh): ${dashboardUsageValue}`);

    // Click on the session value to open details
    await dashboardPage.clickSessionValue();
    await page.waitForTimeout(5000); // Wait for details to load

    // Apply filter
    await dashboardPage.filterButton();
    await page.waitForTimeout(2000);
    await dashboardPage.selectFilter();
    await page.waitForTimeout(2000);
    await dashboardPage.threeDots();
    await page.waitForTimeout(2000);
    await dashboardPage.downloadReport();
    await page.waitForTimeout(10000); // Wait for the download to complete
    });
};

// Export the DashboardValidation function to be used elsewhere
module.exports = {
    DashboardValidation,
};


