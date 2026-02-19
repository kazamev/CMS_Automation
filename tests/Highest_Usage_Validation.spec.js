import { test} from '../fixtures/login.fixture';
import { DashboardPage } from '../pages/DashBoard';
import { DashboardSessionsPage } from "../pages/SesAndUsageValidation";
import{HigUsgPage} from "../pages/Highest_Usage_Validation";
test('Highest Usage Validation', async ({ loggedInPage }) => {
    const page = loggedInPage;
     const HigUsg=new HigUsgPage(page)
    const dashboard = new DashboardPage(page);
    const sessionPage = new DashboardSessionsPage(page);

    // Navigate to dashboard URL here
    await page.goto("https://novo.kazam.in/org/hpcl/9d778325-3fdd-4879-a9f9-b660ca6e240c/cpo/chargers");
    await page.waitForLoadState("networkidle");
      
    const currentUrl = page.url();
    const orgName = currentUrl.split('/org/')[1].split('/')[0];
    //Print organisation name
    console.log(`\nOrganisation: ${orgName}\n`)

   
   function getSelectedDate() {
   const date = new Date();
   date.setDate(date.getDate() - 1);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
    }
   console.log("Selected Date:",getSelectedDate())

  //apply yesterday filter in charger page
  await dashboard.applyTimeFilterinChargerPage("Yesterday");

  //Apply Decending in the charger page
  await HigUsg.UsageFilter();

  //print highest usage row details
  const Values=await HigUsg. HigUsgRow();

  //click Session History
  await HigUsg.SesHistory();

  // Download Excel and count session IDs
  const filePath = await sessionPage.downloadExcel();
  console.log("Downloaded Excel Path:", filePath);
  
  // Count session IDs in the downloaded Excel
  const excelCount = await HigUsg.countExcelSessions(filePath);
  console.log("Excel Session Count:", excelCount);


  //Verify Counts (KPI vs UI vs Excel)
  const result = await HigUsg.verifySessionCounts(filePath, Values.Sessions);
  if (!result.success) {
    console.error("Count Validation Failed:", result.message);
   } else {
    console.log("Count Validation Passed:", result.message);
    }

  //Sum Usage from Excel
  await HigUsg.SumOfUsage(filePath, 9); // Column index for usage
  
  //Verify Usage (KPI vs Excel)
  const usageResult = await HigUsg.verifyUsage(filePath, Values.Usage);
  if (!usageResult.success) {
  console.error("Usage Validation Failed:", usageResult.message);
  } else {
  console.log("Usage Validation Passed:", usageResult.message);
      }
});