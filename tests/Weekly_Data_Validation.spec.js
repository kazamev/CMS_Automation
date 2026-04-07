import { test, expect } from '../fixtures/login.fixture';
import { DataValidation } from "../pages/Weekly_Data_Validation";

test('Validate Session,Usage,Online percentage,Revenue', async () => {
        test.setTimeout(200000)
          const dataValidation = new DataValidation(page);
          await page.goto("https://novo.kazam.in/org/zynetic_electric_vehicle_charging_llc/7aff5403-3de3-4273-9665-099574cf2048/cpo");
          await page.waitForLoadState("networkidle");

//Apply Time Filter in Dashboard
      await dataValidation.ApplyTimeFilterInDashboard("Calendar");


//Get KPI Values from Dashboard
      const { sessionKpi, usageKpi, onlineKpi } = await dataValidation.GetKPIValues();
      console.log("Dashboard Session KPI:", sessionKpi);
      console.log("Dashboard Usage KPI:", usageKpi);
      console.log("Dashboard Online KPI:", onlineKpi);
      console.log("Dashboard Revenue KPI:", dataValidation.revenueKpi);

//Navigate to Sessions Page
      await dataValidation.OpenSessionsPage();

//Apply Time Filter in Sessions Page
      await dataValidation.ApplyTimeFilter("Calendar");

//Apply anomaly filter
      await dataValidation.ApplyAnomalyFilter("Anomaly");

//Get Session Tab Counts from UI
      const { allCount, ongoingCount } = await dataValidation.GetSessionTabCounts();
      console.log("All Sessions Count in Session Page:", allCount);
      console.log("Ongoing Sessions Count in Session Page:", ongoingCount);

// Download Excel and count session IDs
        const filePath = await dataValidation.DownloadExcel();
        console.log("Downloaded Excel Path:", filePath);
// Count session IDs in the downloaded Excel
        const excelCount = await dataValidation.CountSessionIdsInExcel(filePath);
        console.log("Excel Session Count:", excelCount);
//Verify Counts (KPI vs UI vs Excel)
        const result = await dataValidation.VerifyCounts(filePath, allCount, sessionKpi);
        
//Sum Usage from Excel
      await dataValidation.SumOfUsage(filePath); // Column index for usage

//Verify Usage (KPI vs Excel)
      const usageResult = await dataValidation.VerifyUsageFromExcel(filePath, usageKpi);

//navigate to the charger page
        await dataValidation.ChargerPage();

//Time filter in charger page
await dataValidation.ApplyTimeFilterinChargerPage(period);

//Download Excel in Charger Page
const filePath2 = await dataValidation.ChargerdownloadExcel();
console.log("Downloaded Excel Path in Charger Page:", filePath2);

//session and usage
await dataValidation.GetSessionsAndUsageFromChargerExcel(filePath2);

//get average online percentage from charger excel
await dataValidation.GetAverageOnlinePercentFromExcel(filePath2);

//session validation
await dataValidation.VerifySessionKPIWithChargerExcel(filePath2, sessionKpi);

//Usage validation
await dataValidation.VerifyUsageKPIWithChargerExcel(filePath2, usageKpi);

//Online % verification
await dataValidation.verifyOnlinePercentWithExcel(filePath2, onlineKpi);

//Navigate to Revenue Page
await page.goto("https://novo.kazam.in/org/vraj_technologies/dc3d9dfe-3cc3-4068-9f7a-091acdcc3756/cpo/revenue_management/overview");
await page.waitForLoadState("networkidle");

//Apply Time Filter in Revenue Page
await dataValidation.SelectDate();

//Get Revenue KPI from Dashboard
const revenueKpi = await dataValidation.printRevenueValues();
console.log("Dashboard Revenue KPI:", revenueKpi);

//select sucessful transactions
await dataValidation.SelectSuccessTransactions();

//Download Excel in Revenue Page
const filePath4 = await dataValidation.DownloadExcelFile();

//sum of revenue from excel
await dataValidation.SumOfRevenue(filePath4);

//Verify Revenue (KPI vs Excel)
await dataValidation.VerifyRevenueFromExcel(filePath4, revenueText);

//Verify Dashboard Revenue with Excel Revenue
await dataValidation.VerifyDashboardAndExcelRevenue(filePath4, revenueKpi);

});



 


      









