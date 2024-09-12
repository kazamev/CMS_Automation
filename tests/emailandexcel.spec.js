const { test } = require("@playwright/test");
const path = require("path");
const fs = require('fs');
const { chromium } = require('playwright'); 
const { EmailPage } = require("../pages/GmailValidation");

// Function to handle Email and Excel download
const EmailandExcel = async () => { 
  test("Email download", async ({ page }) => {
    const emailPage = new EmailPage(page);
    const email = "akhilesh@kazam.in";
    const password = "Akbl@1724";
    const localDownloadPath = path.join(__dirname, "../pages/Exceldownload");

    // Ensure the directory exists
    if (!fs.existsSync(localDownloadPath)) {
      fs.mkdirSync(localDownloadPath, { recursive: true });
    }

    // Navigate to Gmail and log in
    await emailPage.navigateToGmail();
    await page.waitForTimeout(2000);
    await emailPage.login(email, password);
    await page.waitForTimeout(2000);

    // Open the first email and download the report
    await emailPage.openFirstEmail();
    await page.waitForTimeout(2000);
    await emailPage.downloadReport(localDownloadPath);
    await page.waitForTimeout(2000);

    // Verify the page title
    const pageTitle = await emailPage.getPageTitle();
    console.log(`Page Title: ${pageTitle}`);
    await page.waitForTimeout(8000);
  });
};

module.exports = { EmailandExcel };