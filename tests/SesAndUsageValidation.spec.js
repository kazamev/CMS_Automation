import { test, expect } from '../fixtures/login.fixture';
import { DashboardSessionsPage } from "../pages/SesAndUsageValidation";

  test.only("Validate Session Counts And Usage Across Dashboard, Sections and Excel", async ({ loggedInPage }) => {
    test.setTimeout(120000);
    const page = loggedInPage;

    // Navigate to dashboard URL here
    await page.goto("https://novo.kazam.in/org/zynetic_electric_vehicle_charging_llc/7aff5403-3de3-4273-9665-099574cf2048/cpo");
    await page.waitForLoadState("networkidle");

    //Create Page Object
    const sessionPage = new DashboardSessionsPage(page);


    //Apply Time Filter in Dashboard
    await sessionPage.applyTimeFilterInDashboard("Yesterday");

    //Get KPI Values from Dashboard
    const { sessionKpi, usageKpi, onlineKpi } = await sessionPage.getKPIValues();
    console.log("Dashboard Session KPI:", sessionKpi);
    console.log("Dashboard Usage KPI:", usageKpi);
    console.log("Dashboard Online KPI:", onlineKpi);

    
    //Navigate to Sessions Page
    await sessionPage.openSessionsPage();

    
    //Apply Time Filter in Sessions Page
    await sessionPage.applyTimeFilter("Yesterday");

    //Apply anomaly filter  
    await sessionPage.applyAnomalyFilter("Anomaly");

    //Get Session Tab Counts from UI
    const { allCount, ongoingCount } = await sessionPage.getSessionTabCounts();
    console.log("All Sessions Count in Session Page:", allCount);
    console.log("Ongoing Sessions Count in Session Page:", ongoingCount);

    // Download Excel and count session IDs
    const filePath = await sessionPage.downloadExcel();
    console.log("Downloaded Excel Path:", filePath);

    // Count session IDs in the downloaded Excel
    const excelCount = await sessionPage.countSessionIdsInExcel(filePath);
    console.log("Excel Session Count:", excelCount);
    
    //Verify Counts (KPI vs UI vs Excel)
    const result = await sessionPage.verifyCounts(filePath, allCount, sessionKpi);
    if (!result.success) {
      console.error("Count Validation Failed:", result.message);
    } else {
      console.log("Count Validation Passed:", result.message);
    }

    //Sum Usage from Excel
    await sessionPage.sumOfUsage(filePath, 9); // Column index for usage

    //Verify Usage (KPI vs Excel)
    const usageResult = await sessionPage.verifyUsageFromExcel(filePath, usageKpi); 
    if (!usageResult.success) {
      console.error("Usage Validation Failed:", usageResult.message);
    } else {
      console.log("Usage Validation Passed:", usageResult.message);
    }
     
//Go to Daily Reports
await sessionPage.openDailyReportsPage();

//Select dropdown value
await sessionPage.selectReportDropdown("Sessions");  
// or "usage", depends on user input

function getYesterdayDate() {
    const date = new Date();
    date.setDate(date.getDate() - 1);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

//Pick calendar date
await sessionPage.selectKazamCalendarDate(getYesterdayDate());
//Generate report

const filePath2 = await sessionPage.downloadSessionReport();
    console.log("Downloaded Excel Path:", filePath2);
//Count txn ids
const dailyTxnCount = await sessionPage.countTxnIdsSessionReport(filePath2);

//Final Validation
const dailyCheck = await sessionPage.verifySessionReportCounts(
    dailyTxnCount,
    sessionKpi,
    excelCount
);

//usage validation from daily report excel and dashboard KPI
const ReportusageResult = await sessionPage.verifyReportUsageFromExcel(filePath2, usageKpi); 
    if (!ReportusageResult.success) {
      console.error("Usage Validation Failed:", ReportusageResult.message);
    } else {
      console.log("Usage Validation Passed:", ReportusageResult.message);
    }

//Select dropdown value
await sessionPage.selectReportDropdown("Chargers");  

//Select Only Configured Chargers
await sessionPage.selectConfigureDropdown("Configured");

// //Pick calendar date
await sessionPage.selectKazamCalendarDate(getYesterdayDate());

//Generate report
const filePath5 = await sessionPage.downloadChargerReport();
console.log("Downloaded Excel Path:", filePath5);

//online percentage average from Report charger Excel
const onlinePercentageAvg = await sessionPage.getAverageOnlinePercentFromExcel(filePath5);
console.log("Avg of Online Percentage from Report Excel:", onlinePercentageAvg);

//Charger Page Validation
    await sessionPage.ChargerPage();

//Apply Time Filter in Charger Page
    await sessionPage.applyTimeFilterinChargerPage("Yesterday");

//Download Charger Excel
    const filePath6 = await sessionPage.ChargerdownloadExcel();
  const { excelSessions, excelUsageMW } =
    await sessionPage.getSessionsAndUsageFromSessionReportExcel(filePath6);

console.log("Charger Excel Usage (MW):", excelUsageMW);
console.log("Charger Excel Sessions:", excelSessions);

const avgOnlinePercent = await sessionPage.getAverageOnlinePercentFromExcel(filePath6);
console.log("Average Online Percent from Charger Excel:", avgOnlinePercent);

//Final Validation with Charger Excel
// await sessionPage.verifyOnlinePercentWithExcel(filePath3, onlineKpi);
await sessionPage.verifyOnlinePercentWithExcel(filePath6,sessionPage.onlineKpi);

// await sessionPage.verifyDashboardKPIWithChargerExcel(filePath3, sessionKpi, usageKpi);
  await sessionPage.verifyDashboardKPIWithChargerExcel( filePath6, sessionPage.sessionKpi, sessionPage.usageKpi);

//Verify Online Percentage (KPI vs Report Excel)
    const ReportOnlinePercentage = await sessionPage.verifyOnlinePercentWithExcel(filePath5,onlinePercentageAvg);
    if (!ReportOnlinePercentage.success) {
      console.error("Report Online Percentage Validation Failed:", ReportOnlinePercentage.message);
    } else {
      console.log(" Report Online Percentage Validation Passed:", ReportOnlinePercentage.message);
    }
  });

  