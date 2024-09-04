const { test } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const DashboardPage = require('../pages/DashboardPage');

let context;
let page;

// Define DashboardValidation as an async function
const DashboardValidation = async () => {
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
        await page.waitForTimeout(5000);
    });

    // Second test for dashboard validation
    test('Dashboard validation', async () => {
        // Initialize the DashboardPage with the page instance
    const dashboardPage = new DashboardPage(page);

    // Get and print dashboard session value
    const dashboardValue = await dashboardPage.getDashboardValue();
    console.log(`Total no of sessions(From Dashboard): ${dashboardValue}`);

    // Get and print dashboard usage value
    const dashboardUsageValue = await dashboardPage.getDashboardUsageValue();
    console.log(`Total Usage (From Dashboard In kWh): ${dashboardUsageValue}`);

    // Click on the session value to open details
    await dashboardPage.clickSessionValue();
    await page.waitForTimeout(5000); // Wait for details to load

    // Apply filter
    await dashboardPage.applyFilter();
    await page.waitForTimeout(6000); // Wait for filter to apply

    // Download the report
    await dashboardPage.downloadReport();
    await page.waitForTimeout(10000); // Wait for the download to complete
    });

    test('Email download', async () => {
    
        // Initialize the GmailPage with the page instance
        const gmailPage = new GmailPage(page);
        const email = "akhilesh@kazam.in";
        const password = "Akbl@1724";
        const localDownloadPath = "C:/Users/Admin/Downloads";
    
        // Navigate to Gmail and perform login
        await gmailPage.gotoGmail();
        await gmailPage.login(email, password);
    
        // Open the first email in the inbox
        await gmailPage.openFirstEmail();
    
        // Download the report from the email
        await gmailPage.downloadReport(localDownloadPath);
    
        // Wait to ensure download is complete
        await page.waitForTimeout(5000);
        console.log(await page.title());
    });

};

// Export the DashboardValidation function to be used elsewhere
module.exports = {
    DashboardValidation,
};


