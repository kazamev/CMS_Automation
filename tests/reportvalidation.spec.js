const { test, expect } = require('@playwright/test');
const { chromium } = require('playwright'); 
const path = require('path');
const ReportPage = require('../pages/ReportsValidation'); // Import your page class
const { EmailPage } = require("../pages/GmailValidation");
const DashboardPage = require('../pages/DashboardPage');

const ReportValidation = async () => {
test("Total No of session validation", async ({ page }) => {
  const reportPage = new ReportPage(page);

  await reportPage.downloadAndConvertReport();
  await page.waitForTimeout(1000);
  console.log("anything");

  const filePath = path.join(process.env.HOME || process.env.USERPROFILE, "../pages/Exceldownload", "converted_session_report.xlsx");

  if (reportPage.fileExists(filePath)) {
    const sheetJson = reportPage.readExcelFile(filePath);
    await page.waitForTimeout(1000);
    const nonEmptyCellCount = reportPage.countNonEmptySessions(sheetJson);

    console.log(`Total no of sessions(From Report): ${nonEmptyCellCount}`);
    console.log(`Total no of sessions(From dashboard): ${global.dashboardValue}`);
    await page.waitForTimeout(2000);


    if (global.dashboardValue == nonEmptyCellCount) {
      console.log("The no of sessions in the report is equal to the No of sessions on the dashbaoard.");
    } else {
      console.log("The no of sessions in the report is NOT equal to the No of sessions on the dashbaoard.");
    }
  }
});

test("Total usage validation", async ({ page }) => {
  const reportPage = new ReportPage(page);

  const filePath = path.join(process.env.HOME || process.env.USERPROFILE, "Downloads", "converted_session_report.xlsx");

  if (reportPage.fileExists(filePath)) {
    await page.waitForTimeout(1000);
    const sheetJson = reportPage.readExcelFile(filePath);
    await page.waitForTimeout(1000);
    const totalUsageFromExcel = reportPage.calculateTotalUsage(sheetJson);
    console.log(`Total Usage (From Excel In kWh): ${totalUsageFromExcel}`);
    console.log(`Total usage (From Dashboard In kWh): ${global.dashboardusageValue}`);
    await page.waitForTimeout(1000);

    const final_value = Math.abs(Math.round(global.dashboardusageValue) - Math.round(totalUsageFromExcel));

    if (final_value <= 1) {
      console.log("The sum of usage in the excel is equal to the total usage of dashboard value.");
    } else {
      console.log("The sum of usage in the excel is NOT equal to the total usage of dashboard value.");
    }
  }
});
}

module.exports= {ReportValidation};