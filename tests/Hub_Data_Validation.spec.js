import { test} from '../fixtures/login.fixture';
import { DashboardPage } from '../pages/DashBoard';
import{HubDataPage} from '../pages/Hub_Data_Validation';
import { DashboardSessionsPage } from "../pages/SesAndUsageValidation";
import { RevenuePage } from "../pages/RevenuePage";


test('Hubwise Data Validation', async ({ loggedInPage }) => {
    const page = loggedInPage;
    const dashboard = new DashboardPage(page);
    const Hubdata=new HubDataPage(page);
    const sessionPage = new DashboardSessionsPage(page);
    const revenuePage = new RevenuePage(page);
     

     // Test Data
        const Data ={
            Hub: "BENGALURU"
            
        }
    // Navigate to dashboard URL here
    await page.goto("https://novo.kazam.in/org/hpcl/9d778325-3fdd-4879-a9f9-b660ca6e240c/cpo");
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

    //apply yesterday fillter
   await dashboard.applyTimeFilterInDashboard("Yesterday");

   //select required Hub In Dashboard
   await Hubdata.HubSelection(Data);

    const { sessionKpi, usageKpi, onlineKpi } = await sessionPage.getKPIValues();
    console.log("Dashboard Session KPI:", sessionKpi);
    console.log("Dashboard Usage KPI(MWh):", usageKpi.toFixed(2));
    console.log("Dashboard Online KPI(%):", onlineKpi);
    console.log("Dashboard Revenue KPI(Rs):", sessionPage.revenueKpi);

    //Charger Page
     await page.goto("https://novo.kazam.in/org/hpcl/9d778325-3fdd-4879-a9f9-b660ca6e240c/cpo/chargers");
    await dashboard.applyTimeFilterinChargerPage("Yesterday");
    
    //SelectHub in charger page
    await Hubdata.applyHubFilter(Data);



    const filePath6 = await sessionPage.ChargerdownloadExcel();
    const { excelSessions, excelUsageMW } =
      await sessionPage.getSessionsAndUsageFromSessionReportExcel(filePath6);
  
  console.log("Charger Excel Usage (MW):", excelUsageMW);
  console.log("Charger Excel Sessions:", excelSessions);
  
   const avgOnlinePercent = await sessionPage.getAverageOnlinePercentFromExcel(filePath6);
  console.log("Average Online Percent from Charger Excel:", avgOnlinePercent);
  
  //Final Validation with Charger Excel
  const onlineResult = await sessionPage.verifyOnlinePercentWithExcel(filePath6,sessionPage.onlineKpi);

if (onlineResult.success) {
    console.log("🟢 Dashboard Online percentage and Charger Excel Online percentage is Matched:",sessionPage.onlineKpi);
} else {
    console.log("🔴 Dashboard Online percentage and Charger Excel Online percentage is not Matched:",sessionPage.onlineKpi);
}

  
 await sessionPage.verifyDashboardKPIWithChargerExcel(
    filePath6, sessionPage.sessionKpi, sessionPage.usageKpi
);
  

     //Navigate to Sessions Page
      await page.goto("https://novo.kazam.in/org/hpcl/9d778325-3fdd-4879-a9f9-b660ca6e240c/cpo/sessions")
      await page.waitForLoadState("networkidle");

     //Apply Time Filter in Sessions Page
      await sessionPage.applyTimeFilter("Yesterday");

      //Hubfilter
      await Hubdata.HubFilter(Data);

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
      }

      //Sum Usage from Excel
      await sessionPage.sumOfUsage(filePath, 9); // Column index for usage
  
      //Verify Usage (KPI vs Excel)
      const USAGEKPI=usageKpi.toFixed(2)
      const usageResult = await sessionPage.verifyUsageFromExcel(filePath, USAGEKPI);
      if (!usageResult.success) {
        console.error("Usage Validation Failed:", usageResult.message);
      } else {
        console.log("Usage Validation Passed:", usageResult.message);
      }


      //Navigate to the Revenue page
      await page.goto("https://novo.kazam.in/org/hpcl/9d778325-3fdd-4879-a9f9-b660ca6e240c/cpo/revenue_management/overview")
      await page.waitForLoadState("networkidle");

      function getYesterdayDate() {
      const date = new Date();
      date.setDate(date.getDate() - 1);
      return String(date.getDate()); //no padStart
}

// Calendar: select particular date
  await revenuePage.selectSingleDate(getYesterdayDate());

  


//Hub Filter
await Hubdata.HubRevenueFilter(Data);



const revenueData = await revenuePage.printRevenueValues();

//select only sucess Transactions in Revenue Page
await Hubdata.selectSuccessTransactions();


 // Download Excel
  const filePath4 = await revenuePage. downloadExcelFile();
  await revenuePage.sumOfRevenue(filePath4);


  // Validate Revenue Sum
    const RevenueResult = await revenuePage.verifyRevenueFromExcel(filePath4,revenueData.revenueText,sessionPage.revenueKpi); 
    if (!RevenueResult.success) {
      console.log("Revenue Validation Failed:", RevenueResult.message);
    }
});