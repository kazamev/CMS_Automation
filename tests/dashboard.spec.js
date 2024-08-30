const { test } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const DashboardPage = require('../pages/DashboardPage');

const DashboardValidation = async () => {
test.beforeEach('Login and navigate to Nikol EV', async ({ page }) => {
        const loginPage = new LoginPage(page);
    
        // Go to the login page
        await loginPage.gotoLoginPage();
    
        // Perform login
        await loginPage.login('akhilesh@kazam.in', 'Akbl@1724');
    
        // Navigate to Nikol EV section
        await loginPage.selectNikolEv();
    });
test('Dashboard validation', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);

    // Navigate to the "NIKOL EV" section
    //await dashboardPage.navigateToNikolEv();

    // Wait for a few seconds (optional, depending on page load speed)
    await page.waitForTimeout(5000);

    // Get and print dashboard session value
    const dashboardValue = await dashboardPage.getDashboardValue();
    console.log(`Total no of sessions (From Dashboard): ${dashboardValue}`);

    // Get and print dashboard usage value
    const dashboardUsageValue = await dashboardPage.getDashboardUsageValue();
    console.log(`Total Usage (From Dashboard In kWh): ${dashboardUsageValue}`);

    // Open usage details
    await dashboardPage.openUsageDetails();
    await page.waitForTimeout(5000);

    // Apply a filter
    await dashboardPage.applyFilter();
    await page.waitForTimeout(6000);

    // Download report
    await dashboardPage.downloadReport();
    await page.waitForTimeout(10000);
});

test('Email download', async ({ page }) => {
    const gmailPage = new GmailPage(page);
    //const localDownloadPath = "C:/Users/Admin/Downloads";
    const localDownloadPath = "C:/Users/kisho/Downloads/CMS Automation_1/CMS_Automation/pages/excel";

    // Navigate to Gmail
    await gmailPage.gotoGmail();

    // Perform login
    await gmailPage.login('akhilesh@kazam.in', 'Akbl@1724');

    // Open the first email in the inbox
    await gmailPage.openFirstEmail();

    // Download the report from the email
    await gmailPage.downloadReport(localDownloadPath);

    // Print the page title for verification
    console.log(await page.title());
});
}

module.exports = {
    DashboardValidation,
  };
