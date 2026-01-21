import { test, expect } from '../fixtures/login.fixture';
import { DailyReportsPage } from "../pages/DailyReportsPage";


// import { DashboardSessionsPage } from "../pages/SesAndUsageValidation";

test.describe("Daily Reports Validation", () => {
  test("Validate Sessions & Chargers Daily Reports", async ({ loggedInPage }) => {
    const page = loggedInPage;
    const ReportPage = new DailyReportsPage(page);

// Go to Daily Reports page
await ReportPage.openDailyReportsPage();

// SESSIONS REPORT 
await ReportPage.selectReportDropdown("Sessions");
await ReportPage.selectKazamCalendarDate(getYesterdayDate());
const sessionsFile = await ReportPage.downloadDailyReport("sessions_daily_report.xlsx");

//Count Txn IDs in Sessions Report
console.log("Downloaded Sessions Report:", sessionsFile);
const dailyTxnCount =await ReportPage.countTxnIdsDailyReport(sessionsFile);
console.log("Sessions Txn Count:", dailyTxnCount);

const UsageSum=await ReportPage.sumOfUsage(sessionsFile);
console.log("Sessions Usage Sum (IN Kw):", UsageSum);


//CHARGERS REPORT
await ReportPage.selectReportDropdown("Chargers");
await ReportPage.selectKazamCalendarDate(getYesterdayDate());
await page.waitForLoadState("networkidle");
await ReportPage.editTableFields(); 
const chargersFile = await ReportPage.downloadDailyReport("chargers_daily_report.xlsx");
console.log("Downloaded Chargers Report:", chargersFile);

//Count Txn IDs in Chargers Report
const chargerTxnCount =await ReportPage.countSessionsInChargersReport(chargersFile);
console.log("Chargers Txn Count:", chargerTxnCount);

//sum of usage in chargers report
const totalusageInChargersReport=await ReportPage.sumOfUsageInChargerReport(chargersFile);
console.log("Total Usage in Chargers Report(IN Kw):", totalusageInChargersReport);

//REVENUE REPORT
await ReportPage.RevenueClick()
await ReportPage.selectKazamCalendarDate(getYesterdayDate());
await page.waitForLoadState("networkidle");

//Download Revenue Report
const revenueFile = await ReportPage.downloadDailyReport("revenue_daily_report.xlsx");
console.log("Downloaded Revenue Report:", revenueFile);

//Sum of Revenue
const TotalRevenue =await ReportPage.sumOfRevenue(revenueFile);
console.log("Revenue Sum:", TotalRevenue);

//sum of usage in revenue report
const RevenueUsageSum=await ReportPage.sumOfUsageInRevenueReport(revenueFile);
console.log("Usage Sum in Revenue Report (IN Kw):", RevenueUsageSum);

//MONTHLY REPORT
await ReportPage.MonthlyReport();   
await ReportPage.selectPreviousMonth();
const MonthlyReport = await ReportPage.downloadDailyReport("Monthly_report.xlsx");
console.log("Downloaded Monthly Report:", MonthlyReport);


//Utility function (declare ONCE)
function getYesterdayDate() {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}
  });
});