// tests/sessionValidation.spec.js
const { test } = require('@playwright/test');
const ReportValidationPage = require('../pages/ReportsValidation');

const ReportValidation = async () => {
test("Total No of session validation", async ({ browser }) => {
    const context = await browser.newContext({ acceptDownloads: true });
    const page = await context.newPage();
    
    //const localDownloadPath = "C:/Users/Admin/Downloads";
    const localDownloadPath = "C:/Users/kisho/Downloads";
    const downloadFilename = "downloaded_report.csv"; // Example filename, adjust as needed
    const dashboardValue = global.dashboardValue; // Assume this is set somewhere in your global state

    // Initialize the ReportValidationPage with necessary paths
    const reportValidationPage = new ReportValidationPage(localDownloadPath, downloadFilename);

    // Define the source and destination paths for the conversion
    const source = path.join(localDownloadPath, downloadFilename);
    const destination = path.join(localDownloadPath, "converted_session_report.xlsx");

    // Convert CSV to XLSX
    await reportValidationPage.convertCsvToXlsx(source, destination);

    // Validate the number of sessions
    await reportValidationPage.validateSessions(dashboardValue);
});
}

module.exports = {
    ReportValidation,
}