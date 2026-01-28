import { test, expect } from '../fixtures/login.fixture';
import { OnlinePercentagePage } from '../pages/OnlinePercentage';
import { DashboardSessionsPage } from "../pages/SesAndUsageValidation";

test('Verify dashboard values', async ({ loggedInPage }) => {
    const page = loggedInPage;

    // Navigate to dashboard URL here
    await page.goto("https://novo.kazam.in/org/zynetic_electric_vehicle_charging_llc/7aff5403-3de3-4273-9665-099574cf2048/cpo");
    await page.waitForLoadState("networkidle");
    const OnlinePer= new OnlinePercentagePage(page);
     const sessionPage = new DashboardSessionsPage(page);

//Time Filter Yesterday
await OnlinePer.applyTimeFilterInDashboard("Yesterday");

//Get Online Percentage KPI from Dashboard
const onlinePercentage = await OnlinePer.getOnlinePercentage();
console.log("Online Percentage KPI:", onlinePercentage);


// click on kpi to go to chargers page
await OnlinePer.clickOnlinePercentage();

//change time period to Yesterday
await sessionPage.applyTimeFilter("Yesterday");

//Download Excel
const filePath = await OnlinePer.downloadExcel();   
const onlineResult = await OnlinePer.getAverageOnlinePercentFromExcel(filePath); // Column index for online percentage
 console.log("Average Online Percentage from Excel:", onlineResult);
 
 
// Validate Online Percentage
    const OnlinePercentageResult = await OnlinePer.verifyOnlinePercentWithExcel(filePath, onlinePercentage);
    if (!OnlinePercentageResult.success) {
      console.error("Online Percentage Validation Failed:", OnlinePercentageResult.message);
    } else {
      console.log("Online Percentage Validation Passed:", OnlinePercentageResult.message);
    }



//Go to Daily Reports
await sessionPage.openDailyReportsPage();

//Select dropdown value
await sessionPage.selectReportDropdown("Chargers");  


//Select Only Configured Chargers
await sessionPage.selectConfigureDropdown("Configured");

//Function to get yesterday date in dd/mm/yyyy format
function getYesterdayDate() {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// //Pick calendar date
await sessionPage.selectKazamCalendarDate(getYesterdayDate());


//Generate report
const filePath2 = await sessionPage.downloadDailyReport();
console.log("Downloaded Excel Path:", filePath2);


//online percentage average from charger Excel
const onlinePercentageAvg = await OnlinePer.getAverageOnlinePercentFromExcel(filePath2);
console.log("Avg of Online Percentage from Report Excel:", onlinePercentageAvg);

//Verify Online Percentage (KPI vs Excel)
    const ReportOnlinePercentage = await OnlinePer.verifyOnlinePercentWithExcel(filePath2, onlinePercentage);
    if (!ReportOnlinePercentage.success) {
      console.error("Report Online Percentage Validation Failed:", ReportOnlinePercentage.message);
    } else {
      console.log(" Report Online Percentage Validation Passed:", ReportOnlinePercentage.message);
    }
  });

