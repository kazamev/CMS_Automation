import { test, expect } from "../fixtures/login.fixture";
import { ChargersPage } from "../pages/ChargersPage";
import { DashboardPage } from "../pages/DashBoard";

test.describe(
  "Validate charger counters & connector status counts (Dashboard vs Charger page)",
  () => {

    test("Dashboard vs Charger page comparison", async ({ loggedInPage }) => {
      const page = loggedInPage;
      const dashboard = new DashboardPage(page);
      const chargers = new ChargersPage(page);
     //Dashboard counts
      await page.goto(
        "https://novo.kazam.in/org/Tyagi_Org/1b8d6bd0-22f5-4cd5-b794-1ce364573a30/cpo",
        { waitUntil: "networkidle" }
      );

      const dashboardCounts = await dashboard.getChargerCounters();
      const dashboardStatus = await dashboard.getConnectorStatusCounts();

      const dashboardData = {
        chargers: dashboardCounts.chargers,
        connectors: dashboardCounts.connectors,
        nonConfigured: dashboardCounts.nonConfigured,

        all: dashboardStatus.all,
        busy: dashboardStatus.busy,
        available: dashboardStatus.available,
        error: dashboardStatus.error
      };

      console.log("Dashboard Data:", dashboardData);

      //charger page counts
      await page.goto(
        "https://novo.kazam.in/org/Tyagi_Org/1b8d6bd0-22f5-4cd5-b794-1ce364573a30/cpo/chargers",
        { waitUntil: "networkidle" }
      );

      const chargerCounts = await chargers.getChargerCounts();
      const chargerStatus = await chargers.getConnectorStatusCounts();

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
      expect(chargerData.chargers).toBe(dashboardData.chargers);
      expect(chargerData.connectors).toBe(dashboardData.connectors);
      expect(chargerData.nonConfigured).toBe(dashboardData.nonConfigured);

      expect(chargerData.all).toBe(dashboardData.all);
      expect(chargerData.busy).toBe(dashboardData.busy);
      expect(chargerData.available).toBe(dashboardData.available);
      expect(chargerData.error).toBe(dashboardData.error);

      console.log(" Dashboard and Charger page counters Match");
  }
);


  // Add Charger Flow
  test("Add Charger End-to-End Flow", async ({ loggedInPage }) => {
    const page = loggedInPage;
    test.setTimeout(120000);
     await page.goto("https://novo.kazam.in/org/Tyagi_Org/1b8d6bd0-22f5-4cd5-b794-1ce364573a30/cpo/chargers");
    await page.waitForLoadState("networkidle");
    const chargers = new ChargersPage(page);

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


    //Check if charger appears in list

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

 await page.reload({ waitUntil: "networkidle" });
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
    console.log("Downloaded Excel file path:", filePath);
    

// Read Charger IDs from Excel
 const chargerIdCount = await chargers.countChargerIdsInExcel(filePath);
    


// Excel Download & Validate count
await chargers.verifyExcelCountMatchesUI(afterCount);


});

  });


