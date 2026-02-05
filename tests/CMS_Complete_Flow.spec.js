import { test, expect } from '../fixtures/login.fixture';
import { OrganisationPage } from '../pages/OrgListpage';
import { DashboardPage } from '../pages/DashBoard';
import { ChargersPage } from "../pages/ChargersPage";
import { ChargerTariffPage } from "../pages/ChargerTariff";
import { DashboardSessionsPage } from "../pages/SesAndUsageValidation";
import { RevenuePage } from "../pages/RevenuePage";
import { TariffPage } from '../pages/DriverTariff';

let context;
let page;

test.describe.serial('CMS End-to-End Integrated Flow', () => {
test.setTimeout(180000)
  test.beforeAll(async ({ browser }) => {
  context = await browser.newContext({
    storageState: 'storageState.json'
  });
  page = await context.newPage();
});

test.beforeEach(async ({}, testInfo) => {
    console.log(`\n===== TEST START: ${testInfo.title} =====\n`);
  });

  test.afterEach(async ({}, testInfo) => {
    console.log(`\n===== TEST END: ${testInfo.title} =====\n`);
  });

 test.afterAll(async () => {
  await page.close();
  await context.close();
});
    //ORGANISATION DETAILS 
   test('Organisation Details Validation', async () => {
    test.setTimeout(180000)
    const orgPage = new OrganisationPage(page);
    await page.goto('https://novo.kazam.in/org');
        
    //Count total organisations
    const count = await orgPage.getOrganisationCount();
    console.log("Total organisations:", count);

    //Print details of a specific organisation
    const orgData = await orgPage.getOrganisationDetailsByName("Atomz Power");
    console.log(orgData);

    // Click rquired organisation
    const requiredOrg = "Atomz Power";
    await orgPage.selectOrganisation(requiredOrg);
    await expect(page).toHaveTitle("Offerings - CMS");
    console.log("Navigated to the offerings page");

    // Click Continue to Dashboard
    await orgPage.clickContinueToDashboard();
     
    //Get organisation details from Manage Org page
    const dashData=await orgPage.getOrganisationDetails();

   //Validate organisation details between org list and dashboard
   await orgPage.validateOrgVsDashboard(orgData, dashData)
    });

  // DASHBOARD VS CHARGER PAGE COMPARISON
     test('Dashboard vs Charger page Data comparison', async () => {
      test.setTimeout(180000)
    const dashboard = new DashboardPage(page);

    // IMPORTANT: no new context, same page
    await page.goto('https://novo.kazam.in/org/zynetic_electric_vehicle_charging_llc/7aff5403-3de3-4273-9665-099574cf2048/cpo');
    await page.waitForLoadState('networkidle');
        await dashboard.applyTimeFilterInDashboard("Yesterday");
       await page.waitForLoadState('networkidle');
       await page.waitForTimeout(5000);
         console.log("Yesterday DashBoard Data");
    const revenue = await dashboard.getRevenue();
    console.log("Revenue:", revenue);
    const sessions = await dashboard.getTotalSessions();
    console.log("Sessions:", sessions);
    const usage = await dashboard.getUsage();
    console.log("Usage:", usage);
    const onlinePercentage = await dashboard.getOnlinePercentage();
    console.log("Online Percentage:", onlinePercentage);
      const dashboardCounts = await dashboard.getDashboardChargerCounts();
      const dashboardStatus = await dashboard.getDashboardConnectorStatusCounts();
      const dashboardData = {
        chargers: dashboardCounts.chargers,
        connectors: dashboardCounts.connectors,
        nonConfigured: dashboardCounts.nonConfigured,


        all: dashboardStatus.All,
        busy: dashboardStatus.Busy,
        available: dashboardStatus.Available,
        error: dashboardStatus.Error
      };
      console.log("Dashboard Data:", dashboardData);

      //navigate to charger page
      await dashboard.navigateToChargersPage();
      await page.waitForLoadState('networkidle');

      //apply time filter in charger page
      await dashboard.applyTimeFilterinChargerPage("Yesterday");
      await page.waitForLoadState('networkidle');

      //get charger page data
      const chargerCounts = await dashboard.getChargerCounts();

     //get connector status counts
      const chargerStatus = await dashboard.getConnectorStatusCounts();

      const chargerData = {
        chargers: chargerCounts.chargers,
        connectors: chargerCounts.connectors,
        nonConfigured: chargerCounts.nonConfigured,

        all: chargerStatus.All,
        busy: chargerStatus.Busy,
        available: chargerStatus.Available,
        error: chargerStatus.Error
      };

      console.log("Charger Page Data:", chargerData);


// Compare Dashboard vs Charger page data
      expect(chargerData.chargers.trim()).toBe(dashboardData.chargers.trim());
      expect(chargerData.connectors.trim()).toBe(dashboardData.connectors.trim());
      expect(chargerData.nonConfigured.trim()).toBe(dashboardData.nonConfigured.trim());
      expect(chargerData.all.trim()).toBe(dashboardData.all.trim());
      // expect(chargerData.busy.trim()).toBe(dashboardData.busy.trim());
      expect(chargerData.available.trim()).toBe(dashboardData.available.trim());
      expect(chargerData.error.trim()).toBe(dashboardData.error.trim());
      console.log(" Dashboard and Charger page counters Match");

    });

    //USER ROLE CREATION, VERIFICATION & DELETION
     test('User Creation And Verification', async () => {
      test.setTimeout(200000)
        const dashboard = new DashboardPage(page);
        await page.goto("https://novo.kazam.in/org/Tyagi_Org/1b8d6bd0-22f5-4cd5-b794-1ce364573a30/cpo/user-management/manage-user");
        await page.waitForLoadState("networkidle");
        // Test Data
        const Data ={
            RoleName: "CMS View Only",
            RoleDescription: "RoleDescription",
            UserEmail: await dashboard.generateDummyEmail(),
            UserDesignation: "QA Engineer"
            
        }

        // Create User Role
        await dashboard.UserCreation(Data);
        await page.waitForTimeout(3000);
        console.log("User Role Created Successfully");

        //Role Verification
        const roleDetails = await dashboard.RoleValidation();
        expect(roleDetails.name).toBe(Data.RoleName);
        expect(roleDetails.description).toBe(Data.RoleDescription);
        console.log("User Role Verified Successfully");
        console.log("Role Name:", roleDetails.name);
        console.log("Role Description:", roleDetails.description);


        // // User Invitation Verification
        // await dashboard.AddUser(Data);
        // await page.waitForTimeout(5000);
        // console.log("User Invitation Sent Successfully to:", Data.UserEmail);


        // Delete User Role
        await dashboard.RoleDeletion();
        await page.waitForTimeout(3000);
        console.log("User Role Deleted Successfully");
        
      });

    //ADD & RECONFIGURE CHARGER
    test('End-to-End Add and Reconfigured Charger Flow', async () => {
      test.setTimeout(200000)
        const chargers = new ChargersPage(page);
        await page.goto("https://novo.kazam.in/org/Tyagi_Org/1b8d6bd0-22f5-4cd5-b794-1ce364573a30/cpo/chargers");
        await page.waitForLoadState("networkidle");
    
    // Before count
    const before = await chargers.getChargerCounts();
    const beforeCount = Number(before.chargers);
    console.log("Before Count:", beforeCount);

    // Open Add Charger page
    await chargers.openAddCharger();
    await page.waitForTimeout(1000);

    // Test Data
    const data = {
      name: "EV Charger",
      hostPhone: "7007916033",
      segment: "Fleet",
      subsegment: "Kazam Hub",
      capacity: "3.3",
      type: "AC",
      parkingType:"4W",
      connectorType: "CCS",
      totalCapacity: "3.3",
      lat: "12.9716",
      long: "77.5946",
      privateCharger: "Yes",
      open247: "Yes",
      imagePath: "tests/testdata/charger.png",
      newChargerName: "Charger Updated",
      newHostPhone: "8431273913",
      newConnectortype:"Industrial"
    };


    //step charger form
    await chargers.fillChargerDetails(data);
    console.log(`Charger added successfully → ${data.name}`);
    const chargerId = await chargers.getChargerId();
    console.log("Generated Charger ID:", chargerId);

    // Click Back button
    await page.locator('//span[text()="Back"]').click();
    await page.waitForLoadState("networkidle");

    // Enter chargerId in search field
    const searchField = page.locator('//input[@type="search"]');
    await searchField.click();
    await searchField.fill(chargerId);

    // Check if <tr> with this charger exists
   const chargerRow = page.locator(`//tr[.//p[text()="${chargerId}"]]`);

  try {
    await chargerRow.waitFor({ state: "visible", timeout: 10000 });
    console.log("New charger added to list");
   } catch (err) {
    console.log("Charger not added to list");
}
  await chargerRow.click();
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(2000);

// Charger Reconfiguration Flow
 await chargers.ChargerReconfiguration(data);
 await page.waitForTimeout(2000);

// Latest Charge Counts
const afterCount = await chargers.getAfterChargerCounts();
console.log("After Count:", afterCount);

//Verify if count increased
    if (afterCount > beforeCount) {
        console.log("Charger count increased");
    } else {
        console.log("Charger count did NOT increase");
    }
// Validate configuration
await chargers.Validateconfiguration(chargerId, data);

// Get Installation & Reconfiguration dates
const { installDate, reconfigDate } = await chargers.ReconfigurationDates();
console.log("Installation Date:", installDate);
console.log("Reconfiguration Date:", reconfigDate);

// Excel Download Flow
const filePath = await chargers.downloadExcel();

// Read Charger IDs from Excel
 const chargerIdCount = await chargers.countChargerIdsInExcel(filePath);
// Excel Download & Validate count
await chargers.verifyExcelCountMatchesUI(afterCount);

    });

    //CHARGER TARIFF CREATION & DELETION
    test('Charger Tariff Creation And Deletion', async () => {
      test.setTimeout(200000)
        const tariffPage = new ChargerTariffPage(page);
        await page.goto("https://novo.kazam.in/org/Tyagi_Org/1b8d6bd0-22f5-4cd5-b794-1ce364573a30/cpo/revenue_management/tariffs");
        await page.waitForLoadState("networkidle");
         
    const tariffName = `Auto_Tariff_${Date.now()}`;
    const chargerId = "244a95";
    const amount = "1";

    // Create tariff
    await tariffPage.createTariff(tariffName);
    await tariffPage.selectStartAndEndDate();
    await tariffPage.addPrice(amount);

    // Search & link charger
    await tariffPage.searchAndLinkCharger(chargerId);

    // Review page
    const reviewDetails = await tariffPage.getReviewAndConfirmDetailsAsTable();

    // Create tariff
    await tariffPage.createTariffFinal();

    //delete tariff after creation
    await tariffPage.deleteTariff(tariffName);
    console.log("Tariff deleted successfully");

    });

    //SESSIONS & USAGE VALIDATION
    test('Validate Session Counts, Usage, Revenue And Online Percentage', async () => {
      test.setTimeout(200000)
        const sessionPage = new DashboardSessionsPage(page);
        await page.goto("https://novo.kazam.in/org/zynetic_electric_vehicle_charging_llc/7aff5403-3de3-4273-9665-099574cf2048/cpo");
        await page.waitForLoadState("networkidle");
         //Apply Time Filter in Dashboard
        await sessionPage.applyTimeFilterInDashboard("Yesterday");


    //Get KPI Values from Dashboard
    const { sessionKpi, usageKpi, onlineKpi } = await sessionPage.getKPIValues();
    console.log("Dashboard Session KPI:", sessionKpi);
    console.log("Dashboard Usage KPI:", usageKpi);
    console.log("Dashboard Online KPI:", onlineKpi);
    console.log("Dashboard Revenue KPI:", sessionPage.revenueKpi);

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

//Pick calendar date
await sessionPage.selectKazamCalendarDate(getYesterdayDate());

//Generate report
const filePath5 = await sessionPage.downloadChargerReport();
console.log("Downloaded Excel Path:", filePath5);

//online percentage average from Report charger Excel
const onlinePercentageAvg = await sessionPage.getAverageOnlinePercentFromExcel(filePath5);
console.log("Avg of Online Percentage from Report Excel:", onlinePercentageAvg);

//download Revenue Report
    await sessionPage.RevenueTab.click();
    await page.waitForLoadState("networkidle");

    //Pick calendar date
await sessionPage.selectKazamCalendarDate(getYesterdayDate());

    const revenueReportPath = await sessionPage.downloadRevenueReport();
    console.log("Downloaded Revenue Report Path:", revenueReportPath);

//sum of Revenue from Revenue Report Excel
    const totalRevenue = await sessionPage.sumOfRevenue(revenueReportPath);
    console.log("Total Revenue from Report Excel:", totalRevenue);

//Revenue Validation
  const revenueValidationResult = await sessionPage.validateRevenue(revenueReportPath, sessionPage.revenueKpi);
  console.log("Revenue Validation Result:", revenueValidationResult);

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
await sessionPage.verifyOnlinePercentWithExcel(filePath6,sessionPage.onlineKpi);

await sessionPage.verifyDashboardKPIWithChargerExcel( filePath6, sessionPage.sessionKpi, sessionPage.usageKpi);

//Verify Online Percentage (KPI vs Report Excel)
    const ReportOnlinePercentage = await sessionPage.verifyOnlinePercentWithExcel(filePath5,onlinePercentageAvg);
    if (!ReportOnlinePercentage.success) {
      console.error("Report Online Percentage Validation Failed:", ReportOnlinePercentage.message);
    } else {
      console.log(" Report Online Percentage Validation Passed:", ReportOnlinePercentage.message);
    }

    });
  

 //REVENUE REPORT
 test('Validate Revenue Report And Invoice', async () => {
  test.setTimeout(200000)
  const revenuePage = new RevenuePage(page);

  // Navigate to dashboard URL here
  await revenuePage.DashBoardURL();

//time filter in dashboard
   await revenuePage.applyTimeFilterInDashboard("Yesterday");
   const DashBoardRevenue = await revenuePage. getDashboardRevenue();

// Login fixture already logged in
  await revenuePage.goto();

function getYesterdayDate() {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return String(date.getDate()); //no padStart
}

// Calendar: select particular date
  await revenuePage.selectSingleDate(getYesterdayDate());
 const revenueData = await revenuePage.printRevenueValues();


 // Download Excel
  const filePath4 = await revenuePage. downloadExcelFile();
  await revenuePage.sumOfRevenue(filePath4);

  // Validate Revenue Sum
    const RevenueResult = await revenuePage.verifyRevenueFromExcel(filePath4,revenueData.revenueText,DashBoardRevenue);
    if (!RevenueResult.success) {
      console.error("Revenue Validation Failed:", RevenueResult.message);
    } else {
      console.log("Revenue Validation Passed:", RevenueResult.message);
    }

  // Open Success Transactions and get Overview Data
  const overviewData = await revenuePage.openSuccessTransactionAndGetOverview();

  // Download Invoice PDF
  const invoiceData = await revenuePage.downloadInvoiceFile();

  // Compare Overview Data with Invoice Data
  const comparison = revenuePage.compareOverviewWithInvoice(overviewData, invoiceData);
    });

// DRIVER TARIFF
    test('Create, Validate and Delete Driver Group And Tariff', async () => {
      test.setTimeout(200000)
        const tariffPage = new TariffPage(page);
        const groupName = "Driver Group101";
        const groupDesc = "Test Driver Group Description";

        const expectedData = {
            'NAME': groupName,
            'DESCRIPTION': groupDesc,
        };

 // Navigate to Revenue Management
    await tariffPage.navigate();

// Navigate to Driver & Vehicle
    await tariffPage.navigateToDriverTariffs();

// Create Driver Group
    await tariffPage.createDriverGroupFlow(groupName, groupDesc);

// Navigate Back to Revenue Management
    await tariffPage.navigate();
       
// Create Driver Tariff
    await tariffPage.DriverTariffCreation(groupName);

//Print Tariff Details
    await tariffPage. getDriverDetailsAsTables(groupName);

//Delete Driver Tariff
    await tariffPage.tariffDeletionFlow();

// Navigate to Driver & Vehicle
    await tariffPage.navigateToDriverTariffs();

// Delete Driver Group
    await tariffPage.DriverGroupDltion(groupName);

    });
});