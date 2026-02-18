import { test} from '../fixtures/login.fixture';
import { DashboardPage } from '../pages/DashBoard';
import{StateDataPage} from '../pages/State_Data_Validation';
import { DashboardSessionsPage } from "../pages/SesAndUsageValidation";


test('Statewise Data Validation', async ({ loggedInPage }) => {
    const page = loggedInPage;
    const dashboard = new DashboardPage(page);
    const statedata=new StateDataPage(page);
    const sessionPage = new DashboardSessionsPage(page);

         // Test Data
            const Data ={
                State: "Dubai"
                
            }
        // Navigate to dashboard URL here
        await page.goto("https://novo.kazam.in/org/zynetic_electric_vehicle_charging_llc/7aff5403-3de3-4273-9665-099574cf2048/cpo");
        await page.waitForLoadState("networkidle");
          
    
        const currentUrl = page.url();
        const orgName = currentUrl.split('/org/')[1].split('/')[0];
    
        //Print organisation name
            console.log(`\nOrganisation: ${orgName}\n`)
    
    
        //apply yesterday fillter
       await dashboard.applyTimeFilterInDashboard("Yesterday");
    
       //select required state
       await statedata.StateSelection(Data)
    
        const { sessionKpi, usageKpi, onlineKpi } = await sessionPage.getKPIValues();
        console.log("Dashboard Session KPI:", sessionKpi);
        console.log("Dashboard Usage KPI(MWh):", usageKpi);
        console.log("Dashboard Online KPI(%):", onlineKpi);
        console.log("Dashboard Revenue KPI(AED):", sessionPage.revenueKpi);
    
        await dashboard.navigateToChargersPage();
        await dashboard.applyTimeFilterinChargerPage("Yesterday");
    
        await statedata.applyStateFilter(Data)
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
          await page.goto("https://novo.kazam.in/org/zynetic_electric_vehicle_charging_llc/7aff5403-3de3-4273-9665-099574cf2048/cpo/sessions")
          await page.waitForLoadState("networkidle");
    
         //Apply Time Filter in Sessions Page
          await sessionPage.applyTimeFilter("Yesterday");
    
          //statefilter
          await statedata.SesStateFilter(Data);
    
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
          const usageResult = await sessionPage.verifyUsageFromExcel(filePath, usageKpi);
          if (!usageResult.success) {
            console.error("Usage Validation Failed:", usageResult.message);
          } else {
            console.log("Usage Validation Passed:", usageResult.message);
          }
    
          });